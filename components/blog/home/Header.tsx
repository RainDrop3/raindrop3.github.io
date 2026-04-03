type HeaderProps = {
  postsCount: number;
  categoriesCount: number;
  tagsCount: number;
  latestUpdatedAt: string;
};

export default function Header({
  postsCount,
  categoriesCount,
  tagsCount,
  latestUpdatedAt,
}: HeaderProps) {
  return (
    <header className="rounded-2xl border border-zinc-200 bg-white p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">RainDrop3</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Tech Blog</h1>
      <p className="mt-2 text-base text-zinc-600">내 맘대로 공부하고 기록하는 블로그</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-lg bg-zinc-100 px-3 py-2">
          <p className="text-zinc-500">총 글</p>
          <p className="font-semibold">{postsCount}</p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2">
          <p className="text-zinc-500">카테고리</p>
          <p className="font-semibold">{categoriesCount}</p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2">
          <p className="text-zinc-500">태그</p>
          <p className="font-semibold">{tagsCount}</p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2">
          <p className="text-zinc-500">최근 업데이트</p>
          <p className="font-semibold">{latestUpdatedAt}</p>
        </div>
      </div>
    </header>
  );
}