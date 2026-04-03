import ProfileCard from "@/components/blog/ProfileCard";
import Sidebar from "@/components/blog/Sidebar";
import { getAllPostsMeta, getCategorySummaries } from "@/lib/posts";

type BlogShellProps = {
  children: React.ReactNode;
};

export default function BlogShell({ children }: BlogShellProps) {
  const posts = getAllPostsMeta();
  const categories = getCategorySummaries();

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 md:grid-cols-[280px_minmax(0,1fr)] md:px-6 md:py-12">
      <aside className="space-y-6 md:sticky md:top-8 md:h-fit">
        <ProfileCard />
        <Sidebar postsCount={posts.length} categories={categories} />
      </aside>

      <div className="space-y-8">{children}</div>
    </main>
  );
}