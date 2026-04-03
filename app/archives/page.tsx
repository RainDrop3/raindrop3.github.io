import Link from "next/link";
import { getAllPostsMeta, getMonthlyArchiveSummaries } from "@/lib/posts";

export default function ArchivesPage() {
  const posts = getAllPostsMeta();
  const archives = getMonthlyArchiveSummaries();

  const monthToPosts = new Map<string, Array<{ slug: string; title: string; dateText: string }>>();
  for (const post of posts) {
    const monthKey = post.date.slice(0, 7);
    const bucket = monthToPosts.get(monthKey);
    if (bucket) {
      bucket.push({ slug: post.slug, title: post.title, dateText: post.dateText });
      continue;
    }

    monthToPosts.set(monthKey, [{ slug: post.slug, title: post.title, dateText: post.dateText }]);
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">아카이브</h1>
        <p className="text-zinc-600">월 단위로 정리된 전체 글 목록입니다.</p>
      </header>

      <div className="mt-6 space-y-2">
        {archives.map((item) => (
          <details key={item.key} className="rounded-lg border border-zinc-200 bg-white open:bg-zinc-50">
            <summary className="flex cursor-pointer items-center justify-between p-3 list-none">
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-700">{item.label}</span>
                <span className="text-sm text-zinc-600">{item.count} posts</span>
              </div>
              <span aria-hidden className="archive-chevron text-xs text-zinc-600">
                ▾
              </span>
            </summary>

            <ul className="border-t border-zinc-200 px-3 py-2">
              {(monthToPosts.get(item.key) ?? []).map((post) => (
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

      {archives.length === 0 && <p className="mt-4 text-zinc-600">아카이브가 없습니다.</p>}
    </section>
  );
}