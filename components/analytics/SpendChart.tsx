"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { useSpendSummary } from "@/hooks/useSpendSummary";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function SpendChart() {
  const { monthlySeries } = useSpendSummary();
  const currency = useStore((s) => s.settings.currency);

  const max = Math.max(...monthlySeries.map((m) => m.amount), 1);

  return (
    <Card className="glass p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-semibold">Monthly spend</h2>
        <span className="text-xs text-muted-foreground">Last 12 months</span>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Projected recurring spend, with spikes on annual/quarterly renewal months.
      </p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySeries} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity={0.95} />
                <stop offset="100%" stopColor="hsl(188 86% 53%)" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="hsl(var(--border))"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(v) => formatCurrency(v, currency, { compact: true })}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-xl">
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground">
                      {formatCurrency(Number(payload[0].value), currency)}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {monthlySeries.map((entry, i) => (
                <Cell
                  key={i}
                  fill="url(#spendGradient)"
                  fillOpacity={entry.amount >= max ? 1 : 0.55}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
