"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({
  size = "md",
  defaultValue = "",
  hiddenFields,
  className,
}: {
  size?: "md" | "lg";
  defaultValue?: string;
  hiddenFields?: Record<string, string>;
  className?: string;
}) {
  return (
    <form
      action="/katalog"
      method="get"
      className={cn(
        "flex w-full overflow-hidden rounded-lg border border-[#b9d4ea] bg-white shadow-sm",
        size === "lg" && "shadow-md",
        className,
      )}
    >
      {hiddenFields &&
        Object.entries(hiddenFields).map(
          ([name, value]) =>
            value ? (
              <input key={name} type="hidden" name={name} value={value} />
            ) : null,
        )}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#5a7a96]" />
        <input
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Поиск запчасти по артикулу, например 11427586926"
          aria-label="Поиск запчастей по артикулу"
          className={cn(
            "w-full border-0 bg-transparent pr-3 pl-9 text-[#152033] outline-none placeholder:text-[#5a7a96]",
            size === "lg" ? "h-12 text-base" : "h-10 text-sm",
          )}
        />
      </div>
      <button
        type="submit"
        className={cn(
          "shrink-0 bg-[#1a6fb5] px-5 font-medium text-white hover:bg-[#155d98]",
          size === "lg" ? "h-12" : "h-10",
        )}
      >
        Найти
      </button>
    </form>
  );
}
