import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategorySummaries, getPostsByCategorySlug } from "@/lib/posts";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getCategorySummaries().map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categorySummary = getCategorySummaries().find((item) => item.slug === category);

  if (!categorySummary) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categorySummary.name} Posts`,
    description: `${categorySummary.name} 카테고리의 글 목록`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categorySummary = getCategorySummaries().find((item) => item.slug === category);

  if (!categorySummary) {
    notFound();
  }

  const posts = getPostsByCategorySlug(category);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7">
      <nav>
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← 홈으로
        </Link>
      </nav>

      <header className="mt-4 space-y-2">
        <h1 className="text-3xl font-bold">{categorySummary.name}</h1>
        <p className="text-zinc-600">총 {categorySummary.count}개 글</p>
      </header>

      <ul className="mt-6 space-y-3">
        {posts.map((post) => (
          <li key={post.slug} className="rounded-lg border border-zinc-200 p-4">
            <Link href={`/posts/${post.slug}`} className="block space-y-2">
              <h2 className="text-lg font-semibold hover:underline">{post.title}</h2>
              <p className="text-sm text-zinc-500">{post.dateText}</p>
              <p className="text-sm text-zinc-700">{post.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}