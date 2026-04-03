import Link from "next/link";
import { getAllPostsMeta, getTagSummaries } from "@/lib/posts";

export default function TagsPage() {
  const posts = getAllPostsMeta();
  const tagSummaries = getTagSummaries();

  const tagToPosts = new Map<string, Array<{ slug: string; title: string }>>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const bucket = tagToPosts.get(tag);
      if (bucket) {
        bucket.push({ slug: post.slug, title: post.title });
        continue;
      }

      tagToPosts.set(tag, [{ slug: post.slug, title: post.title }]);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">태그</h1>
        <p className="text-zinc-600">태그별로 정리된 전체 글 목록입니다.</p>
      </header>

      <div className="mt-6 space-y-2">
        {tagSummaries.map((tag) => (
          <details key={tag.name} className="rounded-lg border border-zinc-200 bg-white open:bg-zinc-50">
            <summary className="flex cursor-pointer items-center justify-between p-3 list-none">
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-700">#{tag.name}</span>
                <span className="text-sm text-zinc-600">{tag.count} posts</span>
              </div>
              <span aria-hidden className="archive-chevron text-xs text-zinc-600">
                ▾
              </span>
            </summary>

            <ul className="border-t border-zinc-200 px-3 py-2">
              {(tagToPosts.get(tag.name) ?? []).map((post) => (
                <li key={post.slug} className="py-2">
                  <Link href={`/posts/${post.slug}`} className="text-sm text-zinc-700 hover:underline">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      {tagSummaries.length === 0 && <p className="mt-4 text-zinc-600">태그가 없습니다.</p>}
    </section>
  );
}