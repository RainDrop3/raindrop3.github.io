import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

type RecentListProps = {
  posts: PostMeta[];
};

export default function RecentList({ posts }: RecentListProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">최신 글</h2>
      </div>

      {posts.length === 0 && (
        <p className="mt-4 rounded-lg border border-dashed border-zinc-300 p-6 text-zinc-600">
          조건에 맞는 글이 없습니다. content/posts 폴더에 MDX 글을 추가해보세요.
        </p>
      )}

      <ul className="mt-5 space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="rounded-xl border border-zinc-200 p-5 transition hover:bg-zinc-100">
            <Link href={`/posts/${post.slug}`} className="block space-y-2">
              <h3 className="text-lg font-semibold hover:underline">{post.title}</h3>
              <p className="text-sm text-zinc-500">
                {post.dateText} · {post.category}
              </p>
              <p className="text-sm text-zinc-700">{post.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}