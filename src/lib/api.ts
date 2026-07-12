import type { Post, PostListResponse, PostSingleResponse } from "@/types/blog";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

if (!STRAPI_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_STRAPI_API_URL environment variable.",
  );
}

export const CACHE_TAGS = {
  posts: "posts",
  post: (slug: string) => `post:${slug}`,
} as const;

interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
  searchParams?: Record<string, string | number | boolean | undefined>;
}

async function fetchStrapi<T>(
  path: string,
  { revalidate = 60, tags, searchParams }: FetchOptions = {},
): Promise<T> {
  const url = new URL(`/api${path}`, STRAPI_URL);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url, {
    next: { revalidate, tags },
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Strapi request failed: ${res.status} ${res.statusText} (${url.pathname})`,
    );
  }

  return (await res.json()) as T;
}

export async function getPosts(): Promise<Post[]> {
  const json = await fetchStrapi<PostListResponse>("/posts", {
    tags: [CACHE_TAGS.posts],
    searchParams: {
      "populate[cover]": "true",
      "sort[0]": "publishedAt:desc",
      "pagination[pageSize]": 100,
    },
  });
  return json.data;
}

export async function getPostSlugs(): Promise<string[]> {
  const json = await fetchStrapi<PostListResponse>("/posts", {
    tags: [CACHE_TAGS.posts],
    searchParams: {
      "fields[0]": "slug",
      "pagination[pageSize]": 500,
    },
  });
  return json.data.map((p) => p.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const json = await fetchStrapi<PostListResponse>("/posts", {
    tags: [CACHE_TAGS.post(slug), CACHE_TAGS.posts],
    searchParams: {
      "filters[slug][$eq]": slug,
      "populate[cover]": "true",
      "pagination[pageSize]": 1,
    },
  });
  return json.data[0] ?? null;
}

export function getStrapiMediaUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return new URL(url, STRAPI_URL).toString();
}

export type { Post, PostListResponse, PostSingleResponse };
