import type { Metadata } from "next";
import Link from "next/link";
import "./privacy.css";

export const metadata: Metadata = {
  title: "Privacy Policy - 7 Letter Words With These Letters",
  description: "Privacy policy for 7letterwordswiththeseletters.com. We do not track your gameplay, store your rack letters, or send your tile queries to any server.",
  alternates: { canonical: "https://7letterwordswiththeseletters.com/privacy/" },
};

const SECTIONS = [
  { id: "browser-processing", label: "Browser-Side Processing" },
  { id: "information-collect", label: "Information We Collect" },
  { id: "third-party",        label: "Third-Party Services" },
  { id: "gdpr-rights",        label: "GDPR Rights" },
  { id: "ccpa-rights",        label: "CCPA Rights" },
  { id: "childrens-info",     label: "Children's Information" },
  { id: "consent",            label: "Consent" },
];

export default function PrivacyPage() {
  return (
    <div className="pp-page">

      {/* ── Header ── */}
      <header className="pp-header">
        <Link href="/" className="pp-back">← Back to Home</Link>
        <h1 className="pp-h1">Privacy Policy</h1>
        <p className="pp-meta">Last Updated: August 20, 2026</p>
      </header>

      {/* ── Trust Banner ── */}
      <div className="pp-trust">
        <span className="pp-trust-icon">🛡️</span>
        <div>
          <strong>Privacy at a Glance:</strong> We do not track your gameplay, store your rack letters, or send your tile queries to any server. Every word lookup happens <strong>100% locally on your device</strong>.
        </div>
      </div>

      {/* ── Body: TOC + content ── */}
      <div className="pp-layout">

        {/* Sticky TOC */}
        <nav className="pp-toc">
          <p className="pp-toc-hd">Contents</p>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="pp-toc-link">{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <div className="pp-content">

          <div className="pp-card pp-intro">
            <p>
              At <strong>7letterwordswiththeseletters.com</strong>, one of our main priorities is the privacy of our visitors.
              This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.
            </p>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at{" "}
              <a href="mailto:hello@7letterwordswiththeseletters.com">hello@7letterwordswiththeseletters.com</a>.
            </p>
          </div>

          <section className="pp-card" id="browser-processing">
            <h2 className="pp-card-h2">1. Browser-Side Processing (Your Letters &amp; Queries)</h2>
            <p>Our 7-Letter Word Finder and anagram solver tools are designed to process your queries entirely within your web browser.</p>
            <ul className="pp-list">
              <li><strong>No Rack Letters Stored:</strong> The letters, tiles, or search inputs you enter into the solver are never transmitted to, stored on, or processed by our external servers.</li>
              <li><strong>Complete Privacy:</strong> All word-matching calculations happen locally on your device, ensuring complete privacy while you search for words.</li>
            </ul>
          </section>

          <section className="pp-card" id="information-collect">
            <h2 className="pp-card-h2">2. Information We Collect</h2>
            <p>Like most standard websites, we may collect minimal non-personally identifiable information automatically provided by your web browser:</p>
            <ul className="pp-list">
              <li>
                <strong>Log Files:</strong> We follow a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
              </li>
              <li>
                <strong>Cookies and Web Beacons:</strong> We use cookies to store information about visitors&apos; preferences, optimize user experience, and ensure the basic functionality of the site.
              </li>
            </ul>
          </section>

          <section className="pp-card" id="third-party">
            <h2 className="pp-card-h2">3. Third-Party Services &amp; Advertising</h2>
            <p>We may partner with third-party vendors and ad networks (such as Google AdSense) to serve advertisements on our site.</p>
            <ul className="pp-list">
              <li>
                <strong>Google DoubleClick DART Cookie:</strong> Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
              </li>
              <li>
                <strong>Opt-Out Option:</strong> Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at:{" "}
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads ↗</a>
              </li>
            </ul>
            <p>
              <strong>Note:</strong> Our Privacy Policy does not apply to other advertisers or websites. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
            </p>
          </section>

          <section className="pp-card" id="gdpr-rights">
            <h2 className="pp-card-h2">4. GDPR Data Protection Rights (European Union)</h2>
            <p>We would like to make sure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR). Every user is entitled to the following:</p>
            <ul className="pp-list">
              <li>The right to access, rectify, or erase any personal data we hold about you.</li>
              <li>The right to restrict or object to our processing of your personal data.</li>
            </ul>
            <p>Since we do not collect personal identities, accounts, or store your typed letters, your personal footprint on our site is naturally minimized by design.</p>
          </section>

          <section className="pp-card" id="ccpa-rights">
            <h2 className="pp-card-h2">5. CCPA Privacy Rights (Do Not Sell My Personal Information — California)</h2>
            <p>Under the California Consumer Privacy Act (CCPA), California consumers have the right to:</p>
            <ul className="pp-list">
              <li>Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data collected.</li>
              <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
              <li>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data.</li>
            </ul>
            <p><strong>We do not sell personal information.</strong></p>
          </section>

          <section className="pp-card" id="childrens-info">
            <h2 className="pp-card-h2">6. Children&apos;s Information</h2>
            <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
            <p>We do not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
          </section>

          <section className="pp-card" id="consent">
            <h2 className="pp-card-h2">7. Consent</h2>
            <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
          </section>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="pp-footer">
        <p>
          <Link href="/">7 Letter Words With These Letters</Link>
          {" · "}
          <Link href="/privacy/">Privacy Policy</Link>
        </p>
        <p>© 2026 7letterwordswiththeseletters.com</p>
      </footer>

    </div>
  );
}
