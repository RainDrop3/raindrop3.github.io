import Link from "next/link";

type PopularTagProps = {
  tags: Array<{ name: string; count: number }>;
};

export default function PopularTag({ tags }: PopularTagProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">인기 태그</h3>
        <Link href="/tags" className="text-sm text-zinc-500 hover:text-zinc-900">
          더보기
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag.name} className="rounded-full border border-zinc-300 px-3 py-1 text-sm">
            #{tag.name} ({tag.count})
          </span>
        ))}
        {tags.length === 0 && <p className="text-sm text-zinc-500">태그가 아직 없습니다.</p>}
      </div>
    </div>
  );
}