import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar } from "lucide-react";
import { getPostBySlug, getPostSlugs, getStrapiMediaUrl } from "@/lib/api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.error("[generateStaticParams] Failed to load slugs:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await safeGetPost(slug);
  if (!post) return { title: "Post not found" };

  const { title, content } = post.attributes;
  const description = plainText(content).slice(0, 160);
  return { title, description };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await safeGetPost(slug);
  if (!post) notFound();

  const { title, content, publishedAt, cover } = post.attributes;
  const coverUrl = getStrapiMediaUrl(cover?.data?.attributes.url);
  const coverAlt = cover?.data?.attributes.alternativeText ?? title;

  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All writing
      </Link>

      <header className="mt-10">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Calendar className="size-3" />
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
      </header>

      {coverUrl ? (
        <figure className="mt-10 overflow-hidden rounded-2xl border border-border/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={coverAlt}
            className="h-auto w-full object-cover"
          />
        </figure>
      ) : null}

      <div className="mt-12 whitespace-pre-wrap font-serif text-lg leading-[1.8] tracking-[-0.005em] text-foreground/90 sm:text-xl sm:leading-[1.75]">
        {content}
      </div>
    </article>
  );
}

async function safeGetPost(slug: string) {
  try {
    return await getPostBySlug(slug);
  } catch (err) {
    console.error(`[PostPage] Failed to load post "${slug}":`, err);
    return null;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function plainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`~\-]+/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
