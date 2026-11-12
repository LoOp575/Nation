"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Compass,
  Database,
  EyeOff,
  FileSearch,
  Globe2,
  Landmark,
  LayoutGrid,
  Menu,
  Moon,
  Newspaper,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  FISCAL_YEARS,
  REGION_SCOPES,
  useWorkspace,
} from "@/components/workspace-context";

type NavItem = {
  href: string;
  label: string;
  keywords: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const navigation: { group: string; items: NavItem[] }[] = [
  {
    group: "PUSAT KENDALI",
    items: [
      {
        href: "/",
        label: "National Snapshot",
        keywords: "beranda ringkasan ikhtisar negara kondisi utama",
        icon: LayoutGrid,
      },
    ],
  },
  {
    group: "EKONOMI & FISKAL",
    items: [
      {
        href: "/fiscal-monetary",
        label: "Fiskal, Utang & Pajak",
        keywords: "utang negara apbn pendapatan pajak penerimaan belanja defisit bi",
        icon: Landmark,
      },
      {
        href: "/economy",
        label: "Economic Intelligence",
        keywords: "pdb inflasi perdagangan harga sektor riil pertumbuhan",
        icon: TrendingUp,
      },
      {
        href: "/social-welfare",
        label: "Social & Welfare",
        keywords: "kemiskinan tenaga kerja pengangguran pendidikan kesehatan",
        icon: Users,
      },
      {
        href: "/development",
        label: "Development Monitor",
        keywords: "proyek pembangunan infrastruktur anggaran milestone",
        icon: Building2,
      },
      {
        href: "/regional",
        label: "Regional Overview",
        keywords: "provinsi wilayah daerah ketimpangan 38",
        icon: Globe2,
      },
    ],
  },
  {
    group: "BERITA, DAMPAK & ANTI-MAFIA",
    items: [
      {
        href: "/news-events",
        label: "Berita & Anti-Cocoklogi",
        keywords: "berita viral klaim fakta hoax cocoklogi peristiwa harian",
        icon: Newspaper,
      },
      {
        href: "/event-impact",
        label: "Dampak Proyek & Rumus",
        keywords: "dampak efek proyek simulasi rumus kalkulator multiplier",
        icon: Activity,
      },
      {
        href: "/anti-mafia",
        label: "Anti-Mafia Watch",
        keywords: "korupsi pengadaan tender lpse kontrak adendum mafia audit",
        icon: ShieldAlert,
      },
      {
        href: "/governance",
        label: "Political & Governance",
        keywords: "kebijakan keputusan pejabat kementerian kronologi",
        icon: Compass,
      },
      {
        href: "/national-risk",
        label: "National Risk",
        keywords: "risiko ketahanan nasional krisis metodologi",
        icon: AlertTriangle,
      },
    ],
  },
  {
    group: "INTELLIGENCE & DATA",
    items: [
      {
        href: "/ai-analyst",
        label: "AI National Analyst",
        keywords: "ai briefing asisten tanya analisis bukti sitasi",
        icon: Sparkles,
      },
      {
        href: "/data-observatory",
        label: "Data Observatory",
        keywords: "sumber bps kemenkeu bi ingestion pipeline supabase",
        icon: Database,
      },
      {
        href: "/data-gaps",
        label: "Data Gaps & Uncertainty",
        keywords: "data kosong keterlambatan celah ketidakpastian",
        icon: EyeOff,
      },
    ],
  },
];

const quickIndex = [
  { label: "Total Utang Pemerintah & Rasio PDB", href: "/fiscal-monetary", tag: "Fiskal" },
  { label: "Pendapatan Negara & Realisasi Pajak", href: "/fiscal-monetary", tag: "APBN" },
  { label: "Alokasi Rp 100 Pajak ke Sektor Publik", href: "/fiscal-monetary", tag: "Transparansi" },
  { label: "Cek Fakta Berita & Anti-Cocoklogi", href: "/news-events", tag: "Berita" },
  { label: "Simulasi Rumus Dampak Proyek (ESTIMATED)", href: "/event-impact#simulator", tag: "Rumus" },
  { label: "Pipeline Pengadaan & Sinyal Anti-Mafia", href: "/anti-mafia", tag: "Akuntabilitas" },
  { label: "Status Koneksi BPS WebAPI & Sumber Resmi", href: "/data-observatory", tag: "Data" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    fiscalYear,
    setFiscalYear,
    regionScope,
    setRegionScope,
    searchOpen,
    setSearchOpen,
  } = useWorkspace();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 30);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  const allModules = useMemo(
    () => navigation.flatMap((section) => section.items),
    [],
  );

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allModules;
    return allModules.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q),
    );
  }, [allModules, query]);

  const filteredQuick = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return quickIndex;
    return quickIndex.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q),
    );
  }, [query]);

  const currentPageLabel = useMemo(() => {
    if (pathname === "/") return "IKHTISAR NASIONAL";
    const found = allModules.find((item) => item.href === pathname);
    return found ? found.label.toUpperCase() : pathname.slice(1).replaceAll("-", " ").toUpperCase();
  }, [allModules, pathname]);

  const activeRegionLabel =
    REGION_SCOPES.find((r) => r.code === regionScope)?.label ?? "Indonesia (Nasional)";

  return (
    <div className="app-frame">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <Link href="/" className="sidebar-brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">NP</span>
          <span className="brand-copy">
            <strong>NATIONAL PULSE</strong>
            <small>INDONESIA MONITOR</small>
          </span>
        </Link>

        <div className="sidebar-context">
          <span className="live-dot" />
          <span>{activeRegionLabel.toUpperCase()}</span>
        </div>

        <nav className="side-nav" aria-label="Navigasi utama">
          {navigation.map((section) => (
            <div className="nav-section" key={section.group}>
              <div className="nav-heading">{section.group}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = item.href === "/" ? pathname === "/" : pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${active ? "active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={16} className="nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-foot-card">
            <span className="foot-kicker">PRINSIP DATA</span>
            <strong>Evidence before conclusions.</strong>
            <p>Fakta resmi (OBSERVED) tidak pernah dicampur dengan klaim media (REPORTED).</p>
          </div>
          <span className="sidebar-version">NATIONAL PULSE · CIVIC COMMAND CENTER</span>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="mobile-scrim"
          aria-label="Tutup navigasi"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="workspace">
        <header className="workspace-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              aria-label="Buka navigasi"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="topbar-breadcrumb">
              <span>INDONESIA</span>
              <i>/</i>
              <strong>{currentPageLabel}</strong>
            </div>
          </div>

          <div className="topbar-controls">
            <button
              type="button"
              className="topbar-search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Cari indikator, proyek, atau modul"
            >
              <Search size={14} />
              <span>Cari utang, pajak, proyek, isu...</span>
              <kbd>⌘K</kbd>
            </button>

            <div className="topbar-select-group">
              <select
                aria-label="Filter wilayah"
                value={regionScope}
                onChange={(e) => setRegionScope(e.target.value)}
                className="topbar-select"
              >
                {REGION_SCOPES.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.label}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter tahun APBN"
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="topbar-select mono-num"
              >
                {FISCAL_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
              title={theme === "light" ? "Mode gelap (Situation Room)" : "Mode terang (Executive)"}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        <div className="workspace-content">{children}</div>

        <footer className="workspace-footer">
          <span>National Pulse · Indonesia Public Accountability Monitor</span>
          <span>Zero fabricated metrics · Provenance & evidence status enforced</span>
        </footer>
      </div>

      {searchOpen && (
        <div className="command-backdrop" role="dialog" aria-modal="true" aria-label="Pencarian cepat">
          <button
            type="button"
            className="command-scrim"
            onClick={() => setSearchOpen(false)}
            aria-label="Tutup pencarian"
          />
          <div className="command-modal">
            <div className="command-input-row">
              <Search size={17} />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ketik topik: utang negara, pajak, anti-mafia, cocoklogi, rumus..."
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSearchOpen(false)}
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            <div className="command-results">
              {filteredQuick.length > 0 && (
                <div className="command-group">
                  <div className="command-group-title">TOPIK & INDIKATOR INTI</div>
                  {filteredQuick.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="command-item"
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(item.href);
                      }}
                    >
                      <FileSearch size={15} />
                      <span>{item.label}</span>
                      <small>{item.tag}</small>
                    </button>
                  ))}
                </div>
              )}

              <div className="command-group">
                <div className="command-group-title">MODUL PEMANTAUAN</div>
                {filteredModules.length > 0 ? (
                  filteredModules.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        type="button"
                        className="command-item"
                        onClick={() => {
                          setSearchOpen(false);
                          router.push(item.href);
                        }}
                      >
                        <Icon size={15} />
                        <span>{item.label}</span>
                        <small>{item.href}</small>
                      </button>
                    );
                  })
                ) : (
                  <div className="command-empty">
                    <BarChart3 size={16} /> Tidak ada modul yang cocok dengan &ldquo;{query}&rdquo;.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
