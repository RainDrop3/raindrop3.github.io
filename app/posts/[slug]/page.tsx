import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPostsMeta, getPostBySlug } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7">
      <nav>
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← 홈으로
        </Link>
      </nav>

      <header className="mt-4 space-y-3 border-b border-zinc-200 pb-5">
        <p className="text-sm text-zinc-500">
          {post.dateText} · {post.category}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-zinc-700">{post.summary}</p>
      </header>

      <article className="mdx-body mt-6">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </article>
    </section>
  );
}