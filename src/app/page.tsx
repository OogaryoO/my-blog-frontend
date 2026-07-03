import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPosts, getStrapiMediaUrl } from "@/lib/api";
import type { Post } from "@/types/blog";

export default async function HomePage() {
  const posts = await safeGetPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Hero />
      <PostsSection posts={posts} />
    </div>
  );
}

async function safeGetPosts(): Promise<Post[]> {
  try {
    return await getPosts();
  } catch (err) {
    console.error("[HomePage] Failed to load posts:", err);
    return [];
  }
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-border/60 mt-8 sm:mt-14">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, oklch(0.10 0.03 265 / 0.55), oklch(0.10 0.03 265 / 0.85)), url('/jwst/hero.jpg')",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.35_0.15_320/0.4),transparent_60%)]"
      />
      <div className="px-6 py-20 sm:px-12 sm:py-28 lg:py-36">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="size-3 text-primary" />
          <span>Notes from the deep field</span>
        </div>
        <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-cosmic-gradient">A quiet blog,</span>
          <br />
          <span className="italic text-foreground/90">
            written among the stars.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Essays, notes, and observations — set against the deep-field imagery
          of the James Webb Space Telescope. Reading here should feel like
          stepping outside on a clear night.
        </p>
      </div>
    </section>
  );
}

function PostsSection({ posts }: { posts: Post[] }) {
  return (
    <section className="py-16 sm:py-24">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Latest transmissions
          </p>
          <h2 className="mt-1 font-serif text-3xl tracking-tight sm:text-4xl">
            Recent writing
          </h2>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </header>

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

function PostCard({ post }: { post: Post }) {
  const { title, slug, publishedAt, content, cover } = post.attributes;
  const coverUrl = getStrapiMediaUrl(cover?.data?.attributes.url);
  const excerpt = makeExcerpt(content);

  return (
    <Link
      href={`/posts/${slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:ring-primary/40 group-hover:shadow-[0_0_40px_-10px_oklch(0.72_0.17_320_/_0.35)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-muted/30">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={cover?.data?.attributes.alternativeText ?? title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,oklch(0.35_0.15_320/0.5),oklch(0.14_0.03_265)_70%)]" />
          )}
        </div>
        <CardHeader>
          <CardDescription className="font-mono text-[11px] uppercase tracking-widest">
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          </CardDescription>
          <CardTitle className="font-serif text-xl leading-snug tracking-tight transition-colors group-hover:text-primary">
            {title}
          </CardTitle>
        </CardHeader>
        {excerpt ? (
          <CardContent>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {excerpt}
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary/90">
              Read <ArrowUpRight className="size-3" />
            </div>
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-10 text-center">
      <p className="font-serif text-2xl italic text-muted-foreground">
        The sky is quiet tonight.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        No posts yet — or the Strapi API is unreachable. Check{" "}
        <code className="font-mono text-xs">NEXT_PUBLIC_STRAPI_API_URL</code>.
      </p>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function makeExcerpt(content: string, max = 180): string {
  if (!content) return "";
  const plain = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`~\-]+/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}
