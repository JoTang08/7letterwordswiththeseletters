import Link from "next/link";
import Sidebar from "./Sidebar";
import WordFinder from "./WordFinder";
import { type PageConfig, PAGE_CONFIGS } from "@/lib/config";

interface WordFinderPageProps {
  config: PageConfig;
  children?: React.ReactNode; // info-section content
}

export default function WordFinderPage({ config, children }: WordFinderPageProps) {
  const { n, wordCount, slug } = config;
  const canonical = n === 7
    ? "https://7letterwordswiththeseletters.com/"
    : `https://7letterwordswiththeseletters.com/${slug}/`;

  // Footer links: all other letter counts
  const footerLinks = PAGE_CONFIGS.filter((c) => c.n !== n);

  return (
    <div className="layout">
      <Sidebar activeN={n} />
      <main className="main">
        <div className="container">
          {/* Header */}
          <header className="page-header">
            <span className="header-eyebrow">Collins SOWPODS · {wordCount.toLocaleString()} words</span>
            <h1 className="header-h1">
              <span className="header-h1-line1"><span className="header-num">{n}</span> Letter Words</span>
              <span className="header-h1-line2">With These Letters</span>
            </h1>
            <p className="header-sub">
              Type your letters and instantly find all {n}-letter words you can make
            </p>
          </header>

          {/* Interactive finder (client component) */}
          <WordFinder config={config} />

          {/* SEO content */}
          {children}

          {/* Footer */}
          <footer className="page-footer">
            <p>
              Also try:{" "}
              {footerLinks.map((c, i) => (
                <span key={c.n}>
                  {i > 0 && " · "}
                  <Link href={c.n === 7 ? "/" : `/${c.slug}/`}>
                    {c.n} Letters
                  </Link>
                </span>
              ))}
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              {n} Letter Words With These Letters &copy; 2026
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
