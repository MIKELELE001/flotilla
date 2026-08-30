"use client";

import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { PortfolioSummary } from "@/lib/types";

interface Props {
  summary: PortfolioSummary;
  curve: { t: string; value: number }[];
}

export function EquityChart({ summary, curve }: Props) {
  return (
    <section
      className="rounded-3xl p-7 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm text-[var(--color-text-muted)]">Your Book</div>
      </div>
      <div className="text-3xl font-extrabold tracking-tight mb-6">
        ${summary.totalAtRiskHuman.toFixed(2)}
        <span className="text-sm font-semibold ml-2" style={{ color: "var(--color-up)" }}>
          {summary.upPct}% UP
        </span>
      </div>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={curve} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5a623" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f5a623" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="t"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-text-dim)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface-raised)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--color-text-muted)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f5a623"
              strokeWidth={2.5}
              fill="url(#equityFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
