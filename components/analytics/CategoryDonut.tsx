"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useSpendSummary } from "@/hooks/useSpendSummary";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export function CategoryDonut() {
  const { categoryBreakdown, monthlyTotal } = useSpendSummary();
  const currency = useStore((s) => s.settings.currency);

  const data = categoryBreakdown.map((c) => ({
    name: c.category,
    value: Math.round(c.monthly * 100) / 100,
    color: CATEGORY_COLORS[c.category],
  }));

  return (
    <Card className="glass p-5">
      <h2 className="mb-4 font-semibold">Spend by category</h2>
      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No active spend to chart.</p>
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-52 w-52 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0];
                    return (
                      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-xl">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-muted-foreground">
                          {formatCurrency(Number(p.value), currency)}/mo
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-lg font-bold tabular-nums">
                {formatCurrency(monthlyTotal, currency, { compact: true })}
              </span>
            </div>
          </div>

          <ul className="flex-1 space-y-2 self-stretch">
            {data
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((d) => (
                <li key={d.name} className="flex items-center gap-2.5 text-sm">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: d.color }}
                    aria-hidden
                  />
                  <span className="truncate">{d.name}</span>
                  <span className="ml-auto font-medium tabular-nums">
                    {formatCurrency(d.value, currency)}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
