import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Страница не найдена</h1>
      <p className="mt-3 text-[#5a7a96]">
        Проверьте адрес или найдите запчасть по артикулу в каталоге.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#1a6fb5] px-5 text-sm font-medium text-white hover:bg-[#155d98]"
      >
        На главную
      </Link>
    </div>
  );
}
