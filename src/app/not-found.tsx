import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Страница не найдена</h1>
      <p className="mt-3 text-[#5a7a96]">
        Проверьте адрес или найдите запчасть по артикулу в каталоге.
      </p>
      <Button nativeButton={false} render={<Link href="/" />} className="mt-6 h-10 px-5">
        На главную
      </Button>
    </div>
  );
}
