"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  postsCount: number;
  categories: Array<{ name: string; slug: string; count: number }>;
};

export default function Sidebar({ postsCount, categories }: SidebarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentCategorySlug =
    segments[0] === "categories" && segments[1] ? decodeURIComponent(segments[1]) : undefined;

  const isHome = pathname === "/";

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">Categories</h3>
      </div>

      <ul className="mt-3 space-y-1">
        <li>
          <Link
            href="/"
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              isHome
                ? "bg-zinc-900 text-white"
                : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            전체 글 ({postsCount})
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/categories/${category.slug}`}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                currentCategorySlug === category.slug
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {category.name} ({category.count})
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}