"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { group: "EXECUTIVE", items: [
    { href: "/", label: "National Snapshot", icon: "▦" },
  ]},
  { group: "ANALISIS LANJUTAN", items: [
    { href: "/economy", label: "Economic Intelligence", icon: "↗" },
    { href: "/fiscal-monetary", label: "Fiscal & Monetary", icon: "▤" },
    { href: "/social-welfare", label: "Social & Welfare", icon: "◎" },
    { href: "/development", label: "Development Monitor", icon: "⌂" },
    { href: "/regional", label: "Regional Overview", icon: "⌖" },
  ]},
  { group: "TATA KELOLA & PERISTIWA", items: [
    { href: "/governance", label: "Political & Governance", icon: "◇" },
    { href: "/news-events", label: "News & Events", icon: "▧" },
    { href: "/event-impact", label: "Event Impact", icon: "⌁" },
    { href: "/anti-mafia", label: "Anti-Mafia Watch", icon: "⬡" },
    { href: "/national-risk", label: "National Risk", icon: "△" },
  ]},
  { group: "INTELLIGENCE & DATA", items: [
    { href: "/ai-analyst", label: "AI National Analyst", icon: "✳" },
    { href: "/data-observatory", label: "Data Observatory", icon: "◉" },
    { href: "/data-gaps", label: "Data Gaps & Uncertainty", icon: "◌" },
  ]},
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-frame">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <Link href="/" className="sidebar-brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">NP</span>
          <span className="brand-copy"><strong>NATIONAL PULSE</strong><small>INDONESIA INTELLIGENCE</small></span>
        </Link>
        <div className="sidebar-context"><span className="live-dot" /> NATIONAL MONITORING</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((section) => (
            <div className="nav-section" key={section.group}>
              <div className="nav-heading">{section.group}</div>
              {section.items.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname === item.href;
                return <Link key={item.href} href={item.href} className={`nav-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => setMobileOpen(false)}><span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span></Link>;
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-foot-card"><span className="foot-kicker">DATA PRINCIPLE</span><strong>Evidence before conclusions.</strong><p>Setiap klaim harus dapat ditelusuri ke sumbernya.</p></div>
          <span className="sidebar-version">NATIONAL PULSE · EXECUTIVE WORKSPACE</span>
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" aria-label="Tutup navigasi" onClick={() => setMobileOpen(false)} />}
      <div className="workspace">
        <header className="workspace-topbar">
          <button className="mobile-menu-button" aria-label="Buka navigasi" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>☰</button>
          <div className="topbar-breadcrumb"><span>INDONESIA</span><i>/</i><strong>{pathname === "/" ? "EXECUTIVE OVERVIEW" : pathname.slice(1).replaceAll("-", " ").toUpperCase()}</strong></div>
          <div className="topbar-right"><span className="topbar-status"><span className="live-dot" /> DATA-DRIVEN MONITORING</span><span className="topbar-avatar">NP</span></div>
        </header>
        <div className="workspace-content">{children}</div>
        <footer className="workspace-footer"><span>National Pulse</span><span>Data provenance first · Public accountability</span></footer>
      </div>
    </div>
  );
}
