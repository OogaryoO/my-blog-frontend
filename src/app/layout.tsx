import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Telescope } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Stellar Notes — A blog among the stars",
    template: "%s · Stellar Notes",
  },
  description:
    "A personal blog of essays, notes, and observations — set against the deep-field imagery of the James Webb Space Telescope.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 surface-glass">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-medium tracking-tight"
        >
          <Telescope className="size-4 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-serif text-lg italic">Stellar Notes</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Writing
          </Link>
          <a
            href="https://webbtelescope.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            JWST
          </a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} Stellar Notes. Imagery courtesy of{" "}
          <a
            href="https://webbtelescope.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            NASA / ESA / CSA — JWST
          </a>
          .
        </p>
        <p className="font-mono">Ad astra per aspera.</p>
      </div>
    </footer>
  );
}
