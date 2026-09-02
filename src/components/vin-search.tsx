import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function VinSearch({
  defaultValue = "",
  size = "lg",
}: {
  defaultValue?: string;
  size?: "md" | "lg";
}) {
  return (
    <form
      action="/podbor-vin"
      method="get"
      className={cn(
        "flex w-full overflow-hidden rounded-lg border border-[#b9d4ea] bg-white shadow-sm",
        size === "lg" && "shadow-md",
      )}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#5a7a96]" />
        <input
          name="vin"
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={17}
          defaultValue={defaultValue}
          placeholder="VIN, 17 знаков — например WBA31CM0705A12345"
          aria-label="Подбор запчастей по VIN"
          className={cn(
            "w-full border-0 bg-transparent pr-3 pl-9 font-mono tracking-wide text-[#152033] uppercase outline-none placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-[#5a7a96]",
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
        Подобрать
      </button>
    </form>
  );
}
