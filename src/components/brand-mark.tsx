import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/types";

export function BrandMark({
  brand,
  className,
}: {
  brand: Brand;
  className?: string;
}) {
  const cls = cn("h-10 w-auto", className);
  switch (brand) {
    case "BMW":
      return <BmwMark className={cls} />;
    case "Mercedes-Benz":
      return <MercedesMark className={cls} />;
    case "Audi":
      return <AudiMark className={cls} />;
    case "Škoda":
      return <SkodaMark className={cls} />;
    case "Volkswagen":
      return <VwMark className={cls} />;
    case "Porsche":
      return <PorscheMark className={cls} />;
    case "Bentley":
      return <BentleyMark className={cls} />;
  }
}

function BmwMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#1a1a1a" />
      <circle cx="32" cy="32" r="24" fill="#fff" />
      <path d="M32 8 A24 24 0 0 1 56 32 L32 32 Z" fill="#1061b0" />
      <path d="M32 56 A24 24 0 0 1 8 32 L32 32 Z" fill="#1061b0" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );
}

function MercedesMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#1a1a1a" />
      <circle cx="32" cy="32" r="24" fill="#f4f7fb" />
      <path
        d="M32 10 L36 32 L54 44 L32 34 L10 44 L28 32 Z"
        fill="#1a1a1a"
      />
      <circle cx="32" cy="32" r="24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
    </svg>
  );
}

function AudiMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden>
      {[18, 42, 66, 90].map((x) => (
        <circle
          key={x}
          cx={x}
          cy="20"
          r="14"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="3.2"
        />
      ))}
    </svg>
  );
}

function SkodaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#4ba82e" />
      <circle cx="32" cy="32" r="24" fill="#fff" />
      <path
        d="M18 34 L30 18 H38 L28 34 H40 L26 48 H20 L30 34 Z"
        fill="#4ba82e"
      />
      <circle cx="32" cy="32" r="24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>
  );
}

function VwMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#1a3d7c" />
      <circle cx="32" cy="32" r="24" fill="#fff" />
      <path
        d="M14 22 L24 46 H28 L32 30 L36 46 H40 L50 22 H44 L38 40 L32 22 L26 40 L20 22 Z"
        fill="#1a3d7c"
      />
    </svg>
  );
}

function PorscheMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 72" className={className} aria-hidden>
      <path
        d="M28 4 C40 4 50 10 50 22 V50 C50 62 40 68 28 68 C16 68 6 62 6 50 V22 C6 10 16 4 28 4 Z"
        fill="#af0e2d"
      />
      <path
        d="M28 10 C38 10 44 14 44 22 V50 C44 58 38 62 28 62 C18 62 12 58 12 50 V22 C12 14 18 10 28 10 Z"
        fill="#f3e6c4"
      />
      <rect x="24" y="18" width="8" height="36" rx="1" fill="#1a1a1a" />
      <path d="M16 28 H40 V34 H16 Z" fill="#af0e2d" />
    </svg>
  );
}

function BentleyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 48" className={className} aria-hidden>
      <ellipse cx="40" cy="24" rx="18" ry="18" fill="#1a3a2a" />
      <path
        d="M8 24 Q24 6 40 24 Q24 42 8 24 Z M72 24 Q56 6 40 24 Q56 42 72 24 Z"
        fill="#c4a35a"
      />
      <text
        x="40"
        y="29"
        textAnchor="middle"
        fontSize="16"
        fontFamily="Verdana"
        fill="#f3e6c4"
        fontWeight="700"
      >
        B
      </text>
    </svg>
  );
}
