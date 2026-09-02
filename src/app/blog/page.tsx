import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Блог: новости производителей и сервис оригинал",
  description:
    "Новости BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche и Bentley с официальных сайтов производителей и комментарии MBA-parts.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Блог</h1>
      <p className="mt-3 text-[#2c4a66]">
        Следим за официальными пресс-службами производителей и переводим новости
        в практические рекомендации по оригинальным запчастям.
      </p>
      <div className="mt-8 space-y-4">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-[#d5e6f3] bg-white p-6"
          >
            <p className="text-xs font-semibold tracking-wide text-[#1a6fb5] uppercase">
              {post.brand} · {formatDate(post.date)}
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#16324f]">
              <Link href={`/blog/${post.slug}`} className="hover:text-[#1a6fb5]">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#2c4a66]">
              {post.excerpt}
            </p>
            <p className="mt-3 text-xs text-[#5a7a96]">
              Источник:{" "}
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {post.sourceName}
              </a>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
