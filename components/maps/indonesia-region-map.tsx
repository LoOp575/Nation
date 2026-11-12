"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, AlertCircle, CheckCircle2 } from "lucide-react";

type ProvinceEntry = {
  code: string;
  short: string;
  name: string;
  cluster: "Sumatra" | "Jawa" | "Bali & Nusa Tenggara" | "Kalimantan" | "Sulawesi" | "Maluku & Papua";
};

const INDONESIA_PROVINCES: ProvinceEntry[] = [
  // Sumatra (10)
  { code: "ID-AC", short: "ACH", name: "Aceh", cluster: "Sumatra" },
  { code: "ID-SU", short: "SUMUT", name: "Sumatera Utara", cluster: "Sumatra" },
  { code: "ID-SB", short: "SUMBAR", name: "Sumatera Barat", cluster: "Sumatra" },
  { code: "ID-RI", short: "RIAU", name: "Riau", cluster: "Sumatra" },
  { code: "ID-KR", short: "KEPRI", name: "Kepulauan Riau", cluster: "Sumatra" },
  { code: "ID-JA", short: "JAMBI", name: "Jambi", cluster: "Sumatra" },
  { code: "ID-SS", short: "SUMSEL", name: "Sumatera Selatan", cluster: "Sumatra" },
  { code: "ID-BB", short: "BABEL", name: "Kep. Bangka Belitung", cluster: "Sumatra" },
  { code: "ID-BE", short: "BKL", name: "Bengkulu", cluster: "Sumatra" },
  { code: "ID-LA", short: "LPG", name: "Lampung", cluster: "Sumatra" },
  // Jawa (6)
  { code: "ID-BT", short: "BTN", name: "Banten", cluster: "Jawa" },
  { code: "ID-JK", short: "DKI", name: "DKI Jakarta", cluster: "Jawa" },
  { code: "ID-JB", short: "JABAR", name: "Jawa Barat", cluster: "Jawa" },
  { code: "ID-JT", short: "JATENG", name: "Jawa Tengah", cluster: "Jawa" },
  { code: "ID-YO", short: "DIY", name: "DI Yogyakarta", cluster: "Jawa" },
  { code: "ID-JI", short: "JATIM", name: "Jawa Timur", cluster: "Jawa" },
  // Bali & Nusa Tenggara (3)
  { code: "ID-BA", short: "BALI", name: "Bali", cluster: "Bali & Nusa Tenggara" },
  { code: "ID-NB", short: "NTB", name: "Nusa Tenggara Barat", cluster: "Bali & Nusa Tenggara" },
  { code: "ID-NT", short: "NTT", name: "Nusa Tenggara Timur", cluster: "Bali & Nusa Tenggara" },
  // Kalimantan (5)
  { code: "ID-KB", short: "KALBAR", name: "Kalimantan Barat", cluster: "Kalimantan" },
  { code: "ID-KT", short: "KALTENG", name: "Kalimantan Tengah", cluster: "Kalimantan" },
  { code: "ID-KS", short: "KALSEL", name: "Kalimantan Selatan", cluster: "Kalimantan" },
  { code: "ID-KI", short: "KALTIM", name: "Kalimantan Timur", cluster: "Kalimantan" },
  { code: "ID-KU", short: "KALTARA", name: "Kalimantan Utara", cluster: "Kalimantan" },
  // Sulawesi (6)
  { code: "ID-SA", short: "SULUT", name: "Sulawesi Utara", cluster: "Sulawesi" },
  { code: "ID-GO", short: "GTL", name: "Gorontalo", cluster: "Sulawesi" },
  { code: "ID-ST", short: "SULTENG", name: "Sulawesi Tengah", cluster: "Sulawesi" },
  { code: "ID-SR", short: "SULBAR", name: "Sulawesi Barat", cluster: "Sulawesi" },
  { code: "ID-SN", short: "SULSEL", name: "Sulawesi Selatan", cluster: "Sulawesi" },
  { code: "ID-SG", short: "SULTRA", name: "Sulawesi Tenggara", cluster: "Sulawesi" },
  // Maluku & Papua (8)
  { code: "ID-MA", short: "MALUKU", name: "Maluku", cluster: "Maluku & Papua" },
  { code: "ID-MU", short: "MALUT", name: "Maluku Utara", cluster: "Maluku & Papua" },
  { code: "ID-PB", short: "PABAR", name: "Papua Barat", cluster: "Maluku & Papua" },
  { code: "ID-PD", short: "PBD", name: "Papua Barat Daya", cluster: "Maluku & Papua" },
  { code: "ID-PA", short: "PAPUA", name: "Papua", cluster: "Maluku & Papua" },
  { code: "ID-PT", short: "PATENG", name: "Papua Tengah", cluster: "Maluku & Papua" },
  { code: "ID-PP", short: "PAPEG", name: "Papua Pegunungan", cluster: "Maluku & Papua" },
  { code: "ID-PS", short: "PASEL", name: "Papua Selatan", cluster: "Maluku & Papua" },
];

const CLUSTERS: ProvinceEntry["cluster"][] = [
  "Sumatra",
  "Jawa",
  "Bali & Nusa Tenggara",
  "Kalimantan",
  "Sulawesi",
  "Maluku & Papua",
];

export function IndonesiaRegionMap({
  coveredCodes = [],
}: {
  coveredCodes?: string[];
}) {
  const coveredSet = new Set(coveredCodes);
  const [selected, setSelected] = useState<ProvinceEntry>(INDONESIA_PROVINCES[11]); // DKI Jakarta default inspect
  const isCovered = coveredSet.has(selected.code);

  return (
    <div className="region-map-shell">
      <div className="region-map-legend">
        <span className="legend-chip">
          <i className="map-dot covered" /> Terpublikasi ({coveredCodes.length}/38)
        </span>
        <span className="legend-chip">
          <i className="map-dot missing" /> Data belum tersedia ({38 - coveredCodes.length}/38)
        </span>
      </div>

      <div className="archipelago-grid">
        {CLUSTERS.map((cluster) => {
          const items = INDONESIA_PROVINCES.filter((p) => p.cluster === cluster);
          return (
            <div key={cluster} className="cluster-group">
              <div className="cluster-title">{cluster}</div>
              <div className="province-tiles">
                {items.map((province) => {
                  const active = selected.code === province.code;
                  const covered = coveredSet.has(province.code);
                  return (
                    <button
                      key={province.code}
                      type="button"
                      onClick={() => setSelected(province)}
                      className={`province-tile ${covered ? "covered" : "missing"} ${active ? "selected" : ""}`}
                      title={`${province.name} — ${covered ? "Data tersedia" : "Data belum tersedia"}`}
                    >
                      {province.short}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="province-inspector">
        <div className="inspector-left">
          <MapPin size={15} />
          <div>
            <strong>{selected.name}</strong>
            <small>
              Kode wilayah <span className="mono-num">{selected.code}</span> · Klaster {selected.cluster}
            </small>
          </div>
        </div>
        <div className="inspector-right">
          {isCovered ? (
            <span className="inspector-status covered">
              <CheckCircle2 size={14} /> Indikator daerah tersedia
            </span>
          ) : (
            <span className="inspector-status missing">
              <AlertCircle size={14} /> Data provinsi belum tersedia (tidak dianggap nol)
            </span>
          )}
          <Link href="/regional" className="text-link">
            Bandingkan wilayah ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
