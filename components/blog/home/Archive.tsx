import Link from "next/link";

type ArchiveProps = {
  archives: Array<{ key: string; label: string; count: number }>;
};

export default function Archive({ archives }: ArchiveProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">아카이브</h3>
        <Link href="/archives" className="text-sm text-zinc-500 hover:text-zinc-900">
          더보기
        </Link>
      </div>
      <ul className="mt-4 space-y-2">
        {archives.map((item) => (
          <li key={item.key} className="flex items-center justify-between text-sm text-zinc-700">
            <span>{item.label}</span>
            <span>{item.count} posts</span>
          </li>
        ))}
        {archives.length === 0 && <li className="text-sm text-zinc-500">아카이브가 없습니다.</li>}
      </ul>
    </div>
  );
}