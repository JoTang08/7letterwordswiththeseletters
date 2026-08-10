import Link from "next/link";
import { PAGE_CONFIGS } from "@/lib/config";

interface SidebarProps {
  activeN: number;
}

function LogoMark({ n }: { n: number }) {
  return (
    <svg width="44" height="44" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="54" height="54" rx="11" fill="#0F0E0C"/>
      <rect x="1" y="1" width="54" height="54" rx="11" stroke="#C8A96E" strokeWidth="0.8" strokeOpacity="0.22"/>
      <rect x="3.5" y="3.5" width="49" height="49" rx="8.5" stroke="#C8A96E" strokeWidth="0.35" strokeOpacity="0.1"/>
      <line x1="13" y1="15" x2="21.5" y2="41" stroke="#C8A96E" strokeWidth="3.8" strokeLinecap="round"/>
      <line x1="21.5" y1="41" x2="28" y2="23" stroke="#C8A96E" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="28" y1="23" x2="34.5" y2="41" stroke="#C8A96E" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="34.5" y1="41" x2="43" y2="15" stroke="#C8A96E" strokeWidth="3.8" strokeLinecap="round"/>
      <line x1="10" y1="15" x2="16.5" y2="15" stroke="#C8A96E" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="39.5" y1="15" x2="46" y2="15" stroke="#C8A96E" strokeWidth="1.6" strokeLinecap="round"/>
      <text x="46.5" y="50" fontSize="7" fontFamily="DM Mono, monospace" fill="#C8A96E" fillOpacity="0.55" textAnchor="end">{n}</text>
    </svg>
  );
}

export default function Sidebar({ activeN }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo-mark">
        <LogoMark n={activeN} />
      </div>
      <nav className="sidebar-nav">
        {PAGE_CONFIGS.map(({ n, slug }) => {
          const href = n === 7 ? "/" : `/${slug}/`;
          const isActive = n === activeN;
          return (
            <Link
              key={n}
              href={href}
              className={`nav-link${isActive ? " active" : ""}`}
            >
              <span className="nav-num">{n}</span>
              <span className="nav-label">LTR</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <Link href="/privacy/">Privacy</Link>
        <a href="mailto:hello@7letterwordswiththeseletters.com">Contact</a>
      </div>
    </aside>
  );
}
