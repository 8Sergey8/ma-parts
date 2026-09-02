"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar({
  size = "md",
  defaultValue = "",
  className,
}: {
  size?: "md" | "lg";
  defaultValue?: string;
  className?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/katalog?q=${encodeURIComponent(query)}` : "/katalog");
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "flex w-full overflow-hidden rounded-lg border border-[#b9d4ea] bg-white shadow-sm",
        size === "lg" && "shadow-md",
        className,
      )}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#5a7a96]" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск запчасти по артикулу, например 11427586926"
          className={cn(
            "border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0",
            size === "lg" ? "h-12 text-base md:text-base" : "h-10",
          )}
          aria-label="Поиск запчастей по артикулу"
        />
      </div>
      <Button
        type="submit"
        className={cn(
          "rounded-none px-5",
          size === "lg" ? "h-12" : "h-10",
        )}
      >
        Найти
      </Button>
    </form>
  );
}
