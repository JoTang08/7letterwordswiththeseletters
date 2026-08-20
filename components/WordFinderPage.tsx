import Link from "next/link";
import WordFinder from "./WordFinder";
import { type PageConfig, PAGE_CONFIGS } from "@/lib/config";

interface WordFinderPageProps {
  config: PageConfig;
  children?: React.ReactNode;
}

export default function WordFinderPage({ config, children }: WordFinderPageProps) {
  const { n, slug } = config;
  const otherPages = PAGE_CONFIGS.filter((c) => c.n !== n);

  return (
    <div className="wfp-page">

      {/* ── Header ── */}
      <header className="wfp-header">
        <Link href="/" className="wfp-back">← Home</Link>
        <h1 className="wfp-h1">
          {n} Letter Words With These Letters
        </h1>
        <p className="wfp-sub">
          Find every valid {n}-letter word from your letters instantly — sorted by point value.
        </p>
      </header>

      {/* ── Nav pills ── */}
      <nav className="wfp-nav">
        {PAGE_CONFIGS.map((c) => (
          <Link
            key={c.n}
            href={c.n === 7 ? "/" : `/${c.slug}/`}
            className={`wfp-nav-pill${c.n === n ? " active" : ""}`}
          >
            {c.n}
          </Link>
        ))}
      </nav>

      {/* ── Finder ── */}
      <WordFinder config={config} />

      {/* ── SEO content ── */}
      {children && <div className="wfp-seo">{children}</div>}

      {/* ── Footer ── */}
      <footer className="wfp-footer">
        <p>
          Also try:{" "}
          {otherPages.map((c, i) => (
            <span key={c.n}>
              {i > 0 && " · "}
              <Link href={c.n === 7 ? "/" : `/${c.slug}/`}>{c.n} Letters</Link>
            </span>
          ))}
        </p>
        <p>{n} Letter Words With These Letters &copy; 2026 · <Link href="/privacy/">Privacy</Link></p>
      </footer>
    </div>
  );
}
