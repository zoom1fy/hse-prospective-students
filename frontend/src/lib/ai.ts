const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL ?? "";

export interface ChatChunk {
  done: boolean;
  text: string;
}

export async function* streamChat(message: string): AsyncGenerator<ChatChunk> {
  const url = `${AI_BASE_URL}/api/chat`;
  console.log("[chat] send:", { url, message });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  console.log("[chat] response:", { status: response.status, ok: response.ok });

  if (!response.ok || !response.body) {
    console.error("[chat] request failed:", response.status);
    throw new Error(`Chat request failed with ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      let payload: { response?: string; done?: boolean };
      try {
        payload = JSON.parse(line);
      } catch {
        console.warn("[chat] unparsable chunk:", line);
        continue;
      }
      console.log("[chat] chunk:", JSON.stringify(payload));
      yield { done: Boolean(payload.done), text: payload.response ?? "" };
    }
  }
}