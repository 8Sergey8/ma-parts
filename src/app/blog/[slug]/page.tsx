import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, blogPosts } from "@/data/blog";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Статья не найдена" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-[#5a7a96]">
        <Link href="/blog" className="hover:text-[#1a6fb5]">
          Блог
        </Link>
        {" / "}
        {post.brand}
      </p>
      <h1 className="mt-3 text-3xl font-bold text-[#0b3a6e]">{post.title}</h1>
      <p className="mt-2 text-sm text-[#5a7a96]">
        {formatDate(post.date)} · источник{" "}
        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {post.sourceName}
        </a>
      </p>
      <div className="mt-6 space-y-4 leading-relaxed text-[#2c4a66]">
        {post.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </article>
  );
}
