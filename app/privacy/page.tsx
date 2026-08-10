import type { Metadata } from "next";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Privacy Policy - 7 Letter Words With These Letters",
  description: "Privacy policy for 7letterwordswiththeseletters.com",
  alternates: { canonical: "https://7letterwordswiththeseletters.com/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="layout">
      <Sidebar activeN={7} />
      <main className="main">
        <div className="container">
          <header className="page-header" style={{ textAlign: "left" }}>
            <h1 className="header-h1" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Privacy Policy</h1>
            <p className="header-sub">Last updated: January 2026</p>
          </header>

          <div className="info-section" style={{ marginTop: "1.5rem" }}>
            <h2>Overview</h2>
            <p>7letterwordswiththeseletters.com is a free word-finder tool. We are committed to protecting your privacy. This policy explains what data we collect and how we use it.</p>

            <h3>Data We Collect</h3>
            <p>We collect minimal data to operate this service:</p>
            <ul>
              <li><strong>Usage analytics</strong> — We use privacy-friendly analytics to understand how visitors use the site (page views, general location by country). No personal identifiers are stored.</li>
              <li><strong>Letters you enter</strong> — The letters you type into the word finder are processed entirely in your browser. They are never sent to our servers.</li>
            </ul>

            <h3>Cookies</h3>
            <p>We do not use tracking cookies or third-party advertising cookies. Analytics may use a minimal session cookie that does not identify you personally.</p>

            <h3>Third-Party Services</h3>
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Datamuse API</strong> — Used to fetch word frequency and definition data. Letters you search for may be sent to Datamuse when you click the definition button. See <a href="https://www.datamuse.com/api/" target="_blank" rel="noopener noreferrer">Datamuse&apos;s privacy policy</a>.</li>
              <li><strong>Google Fonts</strong> — Used to load web fonts. Google may log font requests. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google&apos;s privacy policy</a>.</li>
              <li><strong>Cloudflare</strong> — Used for hosting and CDN. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare&apos;s privacy policy</a>.</li>
            </ul>

            <h3>Your Rights</h3>
            <p>Since we do not collect personal data, there is nothing to access, correct, or delete. If you have questions, contact us at <a href="mailto:hello@7letterwordswiththeseletters.com">hello@7letterwordswiththeseletters.com</a>.</p>

            <h3>Changes</h3>
            <p>We may update this policy occasionally. Changes will be reflected by the &ldquo;Last updated&rdquo; date above.</p>
          </div>

          <footer className="page-footer">
            <p><Link href="/">← Back to Word Finder</Link></p>
            <p style={{ marginTop: "0.5rem" }}>7 Letter Words With These Letters &copy; 2026</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
