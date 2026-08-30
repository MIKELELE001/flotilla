"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  upPct: number;
  downPct: number;
  totalAtRiskHuman: number;
}

const COLORS = { up: "#f5a623", down: "#ff6b35" };

export function ExposureDonut({ upPct, downPct, totalAtRiskHuman }: Props) {
  const data = [
    { name: "UP", value: upPct },
    { name: "DOWN", value: downPct },
  ];

  return (
    <section
      className="rounded-3xl p-7 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-[var(--color-text-muted)]">Exposure</div>
        <span className="text-xs text-[var(--color-text-dim)]">This week</span>
      </div>

      <div className="relative" style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={62}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill={COLORS.up} />
              <Cell fill={COLORS.down} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-extrabold tracking-tight">${totalAtRiskHuman.toFixed(0)}</div>
          <div className="text-xs text-[var(--color-text-dim)]">at risk</div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.up }} />
          UP <span className="text-[var(--color-text-dim)]">{upPct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.down }} />
          DOWN <span className="text-[var(--color-text-dim)]">{downPct}%</span>
        </div>
      </div>
    </section>
  );
}
