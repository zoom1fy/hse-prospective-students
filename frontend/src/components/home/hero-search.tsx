"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Search } from "@/components/ui/icons";

export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `/universities?q=${encodeURIComponent(query)}` : "/universities");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-surface flex w-full flex-col gap-2 rounded-2xl border p-2 shadow-sm sm:flex-row"
      role="search"
    >
      <div className="flex flex-1 items-center gap-2 px-3">
        <Search className="size-4 shrink-0 text-zinc-400" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Вуз, направление или город — например, «программная инженерия»"
          className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          aria-label="Поиск вузов и программ"
        />
      </div>
      <button type="submit" className={buttonVariants({ size: "lg", className: "sm:w-auto" })}>
        Найти
      </button>
    </form>
  );
}
