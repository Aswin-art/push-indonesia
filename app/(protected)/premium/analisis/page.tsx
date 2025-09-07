// app/premium/page.tsx
"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";

/** ----- Data tren (dipakai untuk snapshot pie) ----- */
const trendBudaya = [
  { month: "Jan", adat: 92, seniPertunjukan: 80, permainanRakyat: 64, kulinerKhas: 120, pakaianAdat: 70, seniRupaKerajinan: 78, ceritaRakyat: 55, bangunanTrad: 66, bahasaAksara: 50 },
  { month: "Feb", adat: 104, seniPertunjukan: 87, permainanRakyat: 70, kulinerKhas: 130, pakaianAdat: 73, seniRupaKerajinan: 82, ceritaRakyat: 58, bangunanTrad: 69, bahasaAksara: 53 },
  { month: "Mar", adat: 96, seniPertunjukan: 83, permainanRakyat: 66, kulinerKhas: 125, pakaianAdat: 71, seniRupaKerajinan: 79, ceritaRakyat: 56, bangunanTrad: 67, bahasaAksara: 52 },
  { month: "Apr", adat: 109, seniPertunjukan: 90, permainanRakyat: 73, kulinerKhas: 138, pakaianAdat: 76, seniRupaKerajinan: 86, ceritaRakyat: 60, bangunanTrad: 72, bahasaAksara: 55 },
  { month: "Mei", adat: 101, seniPertunjukan: 85, permainanRakyat: 68, kulinerKhas: 132, pakaianAdat: 74, seniRupaKerajinan: 83, ceritaRakyat: 57, bangunanTrad: 70, bahasaAksara: 54 },
  { month: "Jun", adat: 115, seniPertunjukan: 93, permainanRakyat: 75, kulinerKhas: 145, pakaianAdat: 79, seniRupaKerajinan: 90, ceritaRakyat: 63, bangunanTrad: 76, bahasaAksara: 58 },
  { month: "Jul", adat: 107, seniPertunjukan: 88, permainanRakyat: 69, kulinerKhas: 139, pakaianAdat: 77, seniRupaKerajinan: 87, ceritaRakyat: 59, bangunanTrad: 73, bahasaAksara: 56 },
  { month: "Agu", adat: 120, seniPertunjukan: 96, permainanRakyat: 77, kulinerKhas: 151, pakaianAdat: 82, seniRupaKerajinan: 94, ceritaRakyat: 66, bangunanTrad: 79, bahasaAksara: 60 },
  { month: "Sep", adat: 111, seniPertunjukan: 90, permainanRakyat: 71, kulinerKhas: 142, pakaianAdat: 80, seniRupaKerajinan: 91, ceritaRakyat: 62, bangunanTrad: 75, bahasaAksara: 59 },
  { month: "Okt", adat: 124, seniPertunjukan: 98, permainanRakyat: 78, kulinerKhas: 156, pakaianAdat: 85, seniRupaKerajinan: 99, ceritaRakyat: 69, bangunanTrad: 82, bahasaAksara: 63 },
  { month: "Nov", adat: 116, seniPertunjukan: 92, permainanRakyat: 72, kulinerKhas: 147, pakaianAdat: 83, seniRupaKerajinan: 95, ceritaRakyat: 64, bangunanTrad: 78, bahasaAksara: 61 },
  { month: "Des", adat: 121, seniPertunjukan: 101, permainanRakyat: 80, kulinerKhas: 160, pakaianAdat: 88, seniRupaKerajinan: 102, ceritaRakyat: 71, bangunanTrad: 85, bahasaAksara: 65 },
];

const TREND_KEYS: { key: keyof (typeof trendBudaya)[number]; label: string; color: string }[] = [
  { key: "adat", label: "Adat Istiadat", color: "#60a5fa" },
  { key: "seniPertunjukan", label: "Seni Pertunjukan", color: "#22c55e" },
  { key: "permainanRakyat", label: "Permainan Rakyat", color: "#f59e0b" },
  { key: "kulinerKhas", label: "Kuliner Khas", color: "#a855f7" },
  { key: "pakaianAdat", label: "Pakaian Adat", color: "#ef4444" },
  { key: "seniRupaKerajinan", label: "Seni Rupa & Kerajinan", color: "#06b6d4" },
  { key: "ceritaRakyat", label: "Cerita Rakyat & Folklore", color: "#84cc16" },
  { key: "bangunanTrad", label: "Bangunan & Arsitektur Trad.", color: "#ec4899" },
  { key: "bahasaAksara", label: "Bahasa & Aksara Daerah", color: "#94a3b8" },
];

const PIE_COLORS = ["#60a5fa", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#06b6d4", "#84cc16", "#ec4899", "#94a3b8"];

const budayaPerProvinsi = [
  { prov: "Aceh", total: 184 },
  { prov: "Sumatera Utara", total: 210 },
  { prov: "Sumatera Barat", total: 175 },
  { prov: "Riau", total: 142 },
  { prov: "Jambi", total: 120 },
  { prov: "Sumatera Selatan", total: 168 },
  { prov: "Bengkulu", total: 96 },
  { prov: "Lampung", total: 130 },
  { prov: "DKI Jakarta", total: 115 },
  { prov: "Jawa Barat", total: 260 },
  { prov: "Jawa Tengah", total: 295 },
  { prov: "DI Yogyakarta", total: 188 },
  { prov: "Jawa Timur", total: 310 },
  { prov: "Banten", total: 105 },
  { prov: "Bali", total: 278 },
  { prov: "NTB", total: 136 },
  { prov: "NTT", total: 190 },
  { prov: "Kalimantan Barat", total: 150 },
  { prov: "Kalimantan Timur", total: 128 },
  { prov: "Sulawesi Selatan", total: 240 },
];

type ViewMode = "charts" | "table";

// Component that uses useSearchParams
function PremiumDashboardContent() {
  const search = useSearchParams();
  const router = useRouter();

  const initialMode = (search.get("mode") === "table" ? "table" : "charts") as ViewMode;
  const [mode, setMode] = useState<ViewMode>(initialMode);

  // === NEW: filter bulanan ===
  const MONTH_LIST = trendBudaya.map((d) => d.month);        // ["Jan","Feb",...,"Des"]
  const [endMonth, setEndMonth] = useState<string>(MONTH_LIST[MONTH_LIST.length - 1]); // default: "Des"
  const [windowMonths, setWindowMonths] = useState<number>(12); // 3 | 6 | 12

  // data yang sudah difilter sesuai window & endMonth
  const filteredTrend = useMemo(() => {
    const endIdx = MONTH_LIST.indexOf(endMonth);
    if (endIdx === -1) return trendBudaya;
    const startIdx = Math.max(0, endIdx - windowMonths + 1);
    return trendBudaya.slice(startIdx, endIdx + 1);
  }, [endMonth, windowMonths]);

  useEffect(() => {
    const m = search.get("mode");
    setMode(m === "table" ? "table" : "charts");
  }, [search]);

  const setModeAndUrl = (m: ViewMode) => {
    router.replace(`/premium${m === "table" ? "?mode=table" : "?mode=charts"}`);
    setMode(m);
  };

  const distribusiPrimer = useMemo(() => {
    const last = trendBudaya[trendBudaya.length - 1];
    return [
      { name: "Adat Istiadat", value: last.adat },
      { name: "Seni Pertunjukan", value: last.seniPertunjukan },
      { name: "Permainan Rakyat", value: last.permainanRakyat },
      { name: "Kuliner Khas", value: last.kulinerKhas },
      { name: "Pakaian Adat", value: last.pakaianAdat },
      { name: "Seni Rupa & Kerajinan", value: last.seniRupaKerajinan },
      { name: "Cerita Rakyat & Folklore", value: last.ceritaRakyat },
      { name: "Bangunan & Arsitektur Tradisional", value: last.bangunanTrad },
      { name: "Bahasa & Aksara Daerah", value: last.bahasaAksara },
    ];
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Charts only */}
      <div className="grid grid-cols-1 gap-6 mt-2">
        {/* Tren kategori */}
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700">
            <div>
              <CardTitle>Tren Kategori Budaya (Bulanan)</CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Menunjukkan kategori budaya yang lagi naik sepanjang tahun.
              </p>
            </div>

            {/* === Filter Bulanan (NEW) === */}
            <div className="flex items-center gap-2 text-xs">
              <label className="text-gray-600 dark:text-gray-400">Rentang</label>
              <select
                value={windowMonths}
                onChange={(e) => setWindowMonths(Number(e.target.value))}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-2 py-1"
              >
                <option value={3}>3 bulan</option>
                <option value={6}>6 bulan</option>
                <option value={12}>12 bulan</option>
              </select>

              <label className="ml-3 text-gray-600 dark:text-gray-400">Sampai</label>
              <select
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-2 py-1"
              >
                {MONTH_LIST.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredTrend} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} width={60} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  {TREND_KEYS.map(({ key, label, color }) => (
                    <Line
                      key={String(key)}
                      type="monotone"
                      dataKey={key}
                      name={label}
                      stroke={color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
                    />
                  ))}
                  <Tooltip<number, string>
                    contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }}
                    labelStyle={{ color: "#111827", fontWeight: 600 }}
                    formatter={(v, name) => [Number(v).toLocaleString("id-ID"), String(name)]}
                  />
                  <Legend wrapperStyle={{ color: "#374151" }} iconType="circle" verticalAlign="bottom" height={24} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Total budaya per provinsi */}
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Total Budaya per Provinsi</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400">Jumlah entitas budaya (contoh data) yang tercatat di setiap provinsi.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[520px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budayaPerProvinsi} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis type="category" dataKey="prov" width={160} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip<number, string>
                    contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }}
                    formatter={(v) => [`${Number(v).toLocaleString("id-ID")} budaya`, "Total"]}
                  />
                  <Bar dataKey="total" radius={[4, 4, 4, 4]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie distribusi kategori */}
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Distribusi Kategori (Primer)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribusiPrimer}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    labelLine={false}
                  >
                    {distribusiPrimer.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip<number, string>
                    contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }}
                    formatter={(v, name) => [`${Number(v).toLocaleString("id-ID")}`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function PremiumDashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96"><div>Loading...</div></div>}>
      <PremiumDashboardContent />
    </Suspense>
  );
}
