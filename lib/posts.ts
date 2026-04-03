import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const POST_EXTENSIONS = [".md", ".mdx"];

function parseDate(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date("1970-01-01");
  }

  return parsed;
}

function toDateKey(value: Date): string {
  const year = value.getFullYear().toString().padStart(4, "0");
  const month = (value.getMonth() + 1).toString().padStart(2, "0");
  const day = value.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toDateText(value: Date): string {
  const year = value.getFullYear().toString().padStart(4, "0");
  const month = (value.getMonth() + 1).toString().padStart(2, "0");
  const day = value.getDate().toString().padStart(2, "0");

  return `${year}.${month}.${day}`;
}

type RawFrontmatter = {
  title?: string;
  date?: string;
  category?: string;
  tags?: string[];
  summary?: string;
  draft?: boolean;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  dateText: string;
  category: string;
  categorySlug: string;
  tags: string[];
  summary: string;
};

export type PostDetail = PostMeta & {
  content: string;
};

export type MonthlyArchiveSummary = {
  key: string;
  label: string;
  count: number;
};

export type TagSummary = {
  name: string;
  count: number;
};

function toSlug(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return slug.length > 0 ? slug : "uncategorized";
}

function parsePostFile(fileName: string): PostDetail | null {
  const fullPath = path.join(POSTS_DIR, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as RawFrontmatter;

  if (frontmatter.draft === true) {
    return null;
  }

  const slug = fileName.replace(/\.(md|mdx)$/i, "");
  const title = frontmatter.title ?? slug;
  const parsedDate = parseDate(frontmatter.date ?? "1970-01-01");
  const date = toDateKey(parsedDate);
  const category = frontmatter.category ?? "uncategorized";

  return {
    slug,
    title,
    date,
    dateText: toDateText(parsedDate),
    category,
    categorySlug: toSlug(category),
    tags: frontmatter.tags ?? [],
    summary: frontmatter.summary ?? "",
    content,
  };
}

export function getAllPosts(): PostDetail[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(POSTS_DIR)
    .filter((fileName) => POST_EXTENSIONS.some((ext) => fileName.toLowerCase().endsWith(ext)))
    .map(parsePostFile)
    .filter((post): post is PostDetail => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllPosts().map(({ content: _content, ...meta }) => meta);
}

export function getPostBySlug(slug: string): PostDetail | null {
  const post = getAllPosts().find((item) => item.slug === slug);
  return post ?? null;
}

export function getCategorySummaries(): Array<{ name: string; slug: string; count: number }> {
  const map = new Map<string, { name: string; slug: string; count: number }>();

  for (const post of getAllPostsMeta()) {
    const existing = map.get(post.categorySlug);
    if (existing) {
      existing.count += 1;
      continue;
    }

    map.set(post.categorySlug, {
      name: post.category,
      slug: post.categorySlug,
      count: 1,
    });
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getPostsByCategorySlug(categorySlug: string): PostMeta[] {
  return getAllPostsMeta().filter((post) => post.categorySlug === categorySlug);
}

export function getMonthlyArchiveSummaries(limit?: number): MonthlyArchiveSummary[] {
  const map = new Map<string, number>();

  for (const post of getAllPostsMeta()) {
    const key = post.date.slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  const summaries = [...map.entries()]
    .map(([key, count]) => ({
      key,
      label: key.replace("-", "."),
      count,
    }))
    .sort((a, b) => b.key.localeCompare(a.key));

  if (typeof limit === "number") {
    return summaries.slice(0, limit);
  }

  return summaries;
}

export function getTagSummaries(limit?: number): TagSummary[] {
  const map = new Map<string, number>();

  for (const post of getAllPostsMeta()) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }

  const summaries = [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  if (typeof limit === "number") {
    return summaries.slice(0, limit);
  }

  return summaries;
}