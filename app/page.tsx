import Archive from "@/components/blog/home/Archive";
import Header from "@/components/blog/home/Header";
import PopularTag from "@/components/blog/home/PopularTag";
import RecentList from "@/components/blog/home/RecentList";
import {
  getAllPostsMeta,
  getCategorySummaries,
  getMonthlyArchiveSummaries,
  getTagSummaries,
} from "@/lib/posts";

export default function Home() {
  const posts = getAllPostsMeta();
  const categories = getCategorySummaries();
  const latestUpdatedAt = posts[0]?.dateText ?? "-";

  const recentPosts = posts.slice(0, 5);
  const topTags = getTagSummaries(5);

  const archives = getMonthlyArchiveSummaries(5);

  return (
    <>
      <Header
        postsCount={posts.length}
        categoriesCount={categories.length}
        tagsCount={topTags.length}
        latestUpdatedAt={latestUpdatedAt}
      />

      <RecentList posts={posts} />

      <section className="grid gap-4 lg:grid-cols-2">
        <PopularTag tags={topTags} />
        <Archive archives={archives} />
      </section>
    </>
  );
}
