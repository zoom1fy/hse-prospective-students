import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const INLINE_PATTERN =
  /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(__[^_\n]+__)|(\*[^*\n]+\*)|(_[^_\n]+_)|(~~[^~\n]+~~)|(\[[^\]\n]+\]\([^)\s]+\))/g;

const HR = /^\s*([-*_])\s*(\1\s*){2,}$/;
const UL = /^\s*[-*+]\s+(.*)$/;
const OL = /^\s*\d+[.)]\s+(.*)$/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;
const FENCE = /^```\s*([\w+-]*)\s*$/;
const FENCE_END = /^```\s*$/;
const TABLE_SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

function safeHref(href: string): string | undefined {
  if (/^(https?:|mailto:)/i.test(href)) return href;
  if (href.startsWith("/") || href.startsWith("#")) return href;
  return undefined;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(INLINE_PATTERN.source, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="bg-muted/20 rounded px-1 py-0.5 font-mono text-[0.8em]">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(
        <strong key={key} className="font-semibold">
          {renderInline(token.slice(2, -2), key)}
        </strong>,
      );
    } else if (token.startsWith("~~")) {
      nodes.push(
        <del key={key} className="opacity-70">
          {renderInline(token.slice(2, -2), key)}
        </del>,
      );
    } else if (token.startsWith("*") || token.startsWith("_")) {
      nodes.push(<em key={key}>{renderInline(token.slice(1, -1), key)}</em>);
    } else if (token.startsWith("[")) {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      const href = link ? safeHref(link[2]) : undefined;
      const label = link ? link[1] : token;
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 dark:text-brand-400 underline underline-offset-2"
          >
            {renderInline(label, key)}
          </a>
        ) : (
          <span key={key}>{renderInline(label, key)}</span>
        ),
      );
    } else {
      nodes.push(token);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderLines(text: string, keyPrefix: string): ReactNode[] {
  const result: ReactNode[] = [];
  text.split("\n").forEach((part, index) => {
    if (index > 0) result.push(<br key={`${keyPrefix}-br-${index}`} />);
    result.push(...renderInline(part, `${keyPrefix}-${index}`));
  });
  return result;
}

function isBlockStart(line: string): boolean {
  return (
    HEADING.test(line) ||
    QUOTE.test(line) ||
    FENCE.test(line) ||
    HR.test(line) ||
    UL.test(line) ||
    OL.test(line)
  );
}

function splitRow(line: string): string[] {
  let row = line.trim();
  if (row.startsWith("|")) row = row.slice(1);
  if (row.endsWith("|")) row = row.slice(0, -1);
  return row.split("|").map((cell) => cell.trim());
}

function renderBlocks(source: string): ReactNode[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = FENCE.exec(line);
    if (fence) {
      const lang = fence[1];
      i++;
      const code: string[] = [];
      while (i < lines.length && !FENCE_END.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push(
        <pre
          key={`block-${blocks.length}`}
          className="border-border bg-surface-muted my-2 overflow-x-auto rounded-lg border p-3 font-mono text-xs leading-relaxed first:mt-0 last:mb-0"
        >
          <code className={lang ? `language-${lang}` : undefined}>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      blocks.push(
        <p
          key={`block-${blocks.length}`}
          className={cn(
            "mt-3 mb-1.5 font-semibold first:mt-0",
            heading[1].length <= 2 ? "text-base" : "text-sm",
          )}
        >
          {renderInline(heading[2], `heading-${blocks.length}`)}
        </p>,
      );
      i++;
      continue;
    }

    if (HR.test(line)) {
      blocks.push(<hr key={`block-${blocks.length}`} className="border-border my-3" />);
      i++;
      continue;
    }

    const quote = QUOTE.exec(line);
    if (quote) {
      const quoted: string[] = [];
      while (i < lines.length) {
        const nested = QUOTE.exec(lines[i]);
        if (!nested) break;
        quoted.push(nested[1]);
        i++;
      }
      blocks.push(
        <blockquote
          key={`block-${blocks.length}`}
          className="border-border text-muted my-2 border-l-2 pl-3 italic first:mt-0 last:mb-0"
        >
          {renderBlocks(quoted.join("\n"))}
        </blockquote>,
      );
      continue;
    }

    const ul = UL.exec(line);
    const ol = ul ? null : OL.exec(line);
    if (ul || ol) {
      const ordered = Boolean(ol);
      const items: string[] = [];
      while (i < lines.length) {
        const item = ordered ? OL.exec(lines[i]) : UL.exec(lines[i]);
        if (!item) break;
        items.push(item[1]);
        i++;
      }
      const itemNodes = items.map((item, index) => (
        <li key={`item-${index}`}>{renderInline(item, `list-${blocks.length}-${index}`)}</li>
      ));
      blocks.push(
        ordered ? (
          <ol
            key={`block-${blocks.length}`}
            className="my-2 list-decimal space-y-1 pl-5 first:mt-0 last:mb-0"
          >
            {itemNodes}
          </ol>
        ) : (
          <ul
            key={`block-${blocks.length}`}
            className="my-2 list-disc space-y-1 pl-5 first:mt-0 last:mb-0"
          >
            {itemNodes}
          </ul>
        ),
      );
      continue;
    }

    const isTable = line.includes("|") && TABLE_SEP.test(lines[i + 1] ?? "");
    if (isTable) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes("|")) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push(
        <div key={`block-${blocks.length}`} className="my-2 overflow-x-auto first:mt-0 last:mb-0">
          <table className="border-border w-full border-collapse text-xs">
            <thead>
              <tr>
                {header.map((cell, index) => (
                  <th
                    key={`th-${index}`}
                    className="border-border border px-2 py-1 text-left font-semibold"
                  >
                    {renderInline(cell, `th-${blocks.length}-${index}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`tr-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`td-${cellIndex}`} className="border-border border px-2 py-1">
                      {renderInline(cell, `td-${blocks.length}-${rowIndex}-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !isBlockStart(lines[i]) &&
      !(lines[i].includes("|") && TABLE_SEP.test(lines[i + 1] ?? ""))
    ) {
      paragraph.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`block-${blocks.length}`} className="my-2 first:mt-0 last:mb-0">
        {renderLines(paragraph.join("\n"), `p-${blocks.length}`)}
      </p>,
    );
  }

  return blocks;
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  return <div className={cn("min-w-0 break-words", className)}>{renderBlocks(content)}</div>;
}
