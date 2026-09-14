"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScanReport } from "@/lib/analyzer/types";

const COLORS = {
  gold: "#e8c07a",
  mint: "#7ee0c6",
  warn: "#f0a35e",
  bad: "#ff6b7a",
  muted: "#9b9588",
};

function tone(score: number) {
  if (score >= 90) return COLORS.mint;
  if (score >= 70) return COLORS.gold;
  if (score >= 50) return COLORS.warn;
  return COLORS.bad;
}

export function CategoryBars({ report }: { report: ScanReport }) {
  const data = [
    { name: "Säkerhet", score: report.security.score },
    { name: "Prestanda", score: report.performance.score },
    { name: "SEO", score: report.seo.score },
    { name: "A11y", score: report.a11y.score },
  ];
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={28}>
          <CartesianGrid stroke="rgba(243,239,228,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#101218",
              border: "1px solid rgba(243,239,228,0.1)",
              borderRadius: 12,
            }}
          />
          <Bar dataKey="score" radius={[10, 10, 4, 4]}>
            {data.map((d) => (
              <Cell key={d.name} fill={tone(d.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryRadar({ report }: { report: ScanReport }) {
  const data = [
    { dim: "Säkerhet", score: report.security.score },
    { dim: "Prestanda", score: report.performance.score },
    { dim: "SEO", score: report.seo.score },
    { dim: "A11y", score: report.a11y.score },
    { dim: "Helhet", score: report.overall },
  ];
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(243,239,228,0.12)" />
          <PolarAngleAxis dataKey="dim" tick={{ fill: COLORS.muted, fontSize: 12 }} />
          <Radar dataKey="score" stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerfBars({ report }: { report: ScanReport }) {
  const data = [
    { name: "TTFB", score: Math.max(0, Math.min(100, 100 - report.performance.ttfbMs / 20)) },
    {
      name: "Storlek",
      score: Math.max(0, Math.min(100, 100 - report.performance.totalBytes / 8000)),
    },
    { name: "Komprimering", score: report.performance.compressed ? 100 : 20 },
    { name: "Redirects", score: report.performance.redirectCount <= 1 ? 90 : 50 },
  ];
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" barSize={14}>
          <CartesianGrid stroke="rgba(243,239,228,0.08)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" width={110} tick={{ fill: COLORS.muted, fontSize: 12 }} axisLine={false} />
          <Bar dataKey="score" radius={[0, 8, 8, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={tone(d.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
