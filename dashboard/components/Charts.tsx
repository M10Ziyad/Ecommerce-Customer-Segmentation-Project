"use client";

import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
} from "recharts";
import type { Customer, SegmentStats } from "@/lib/data";

const AXIS = "#94a3b8";
const GRID = "#eef0f6";
const tooltipStyle = {
    background: "#ffffff",
    border: "1px solid #e5e8f0",
    borderRadius: 10,
    color: "#0f172a",
    boxShadow: "none",
    fontSize: 13,
};
const tooltipText = { color: "#0f172a" };
const cursorFill = { fill: "rgba(28,25,23,0.04)" };

const money = (n: number) =>
    n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `£${(n / 1000).toFixed(0)}k` : `£${n.toFixed(0)}`;

// Short labels keep the x-axis readable on narrow screens.
const short = (name: string) => name.replace(" Shopper", "").replace("High-Value ", "HV ").replace("Loyal ", "Loyal ");

export function CustomerSharePie({ segments }: { segments: SegmentStats[] }) {
    const data = segments.map((s) => ({ name: s.name, value: s.count, color: s.color }));
    const total = data.reduce((a, b) => a + b.value, 0);
    return (
        <div className="chart" style={{ position: "relative" }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3} stroke="#fff" strokeWidth={2}>
                        {data.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipText} formatter={(v) => Number(v).toLocaleString()} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                </PieChart>
            </ResponsiveContainer>
            <div
                style={{
                    position: "absolute",
                    top: "42%",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                }}
            >
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>{total.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>customers</div>
            </div>
        </div>
    );
}

export function RevenueBar({ segments }: { segments: SegmentStats[] }) {
    const data = segments.map((s) => ({ name: short(s.name), revenue: Math.round(s.revenue), color: s.color }));
    return (
        <div className="chart">
            <ResponsiveContainer>
                <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
                    <CartesianGrid stroke={GRID} vertical={false} />
                    <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 12 }} interval={0} tickLine={false} />
                    <YAxis stroke={AXIS} tickFormatter={money} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={tooltipText}
                        cursor={cursorFill}
                        formatter={(v) => [`£${Number(v).toLocaleString()}`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" radius={[8, 8, 0, 0]} maxBarSize={64}>
                        {data.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

/** Compares each segment's share of customers against its share of revenue. */
export function ShareComparison({ segments }: { segments: SegmentStats[] }) {
    const data = segments.map((s) => ({
        name: short(s.name),
        customers: Number((s.countShare * 100).toFixed(1)),
        revenue: Number((s.revenueShare * 100).toFixed(1)),
    }));
    return (
        <div className="chart">
            <ResponsiveContainer>
                <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
                    <CartesianGrid stroke={GRID} vertical={false} />
                    <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 12 }} interval={0} tickLine={false} />
                    <YAxis stroke={AXIS} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={tooltipText}
                        cursor={cursorFill}
                        formatter={(v, name) => [`${v}%`, name === "customers" ? "Share of customers" : "Share of revenue"]}
                    />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: 13 }}
                        formatter={(v) => (v === "customers" ? "Share of customers" : "Share of revenue")}
                    />
                    <Bar dataKey="customers" fill="#d6d3d1" radius={[6, 6, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="revenue" fill="#1c1917" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

type MetricKey = "avgRecency" | "avgFrequency" | "avgMonetary";

export function AvgMetricBar({
    segments,
    metric,
    label,
    prefix = "",
}: {
    segments: SegmentStats[];
    metric: MetricKey;
    label: string;
    prefix?: string;
}) {
    const data = segments.map((s) => ({ name: short(s.name), value: Number(s[metric].toFixed(1)), color: s.color }));
    return (
        <div className="chart">
            <ResponsiveContainer>
                <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
                    <CartesianGrid stroke={GRID} vertical={false} />
                    <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 12 }} interval={0} tickLine={false} />
                    <YAxis stroke={AXIS} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={tooltipText}
                        cursor={cursorFill}
                        formatter={(v) => [`${prefix}${Number(v).toLocaleString()}`, label]}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
                        {data.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function RfmScatter({ customers, segments }: { customers: Customer[]; segments: SegmentStats[] }) {
    const [active, setActive] = useState<Record<number, boolean>>(() =>
        Object.fromEntries(segments.map((s) => [s.cluster, true])),
    );
    const toggle = (c: number) => setActive((a) => ({ ...a, [c]: !a[c] }));

    return (
        <div>
            <div className="chips">
                {segments.map((s) => (
                    <button
                        key={s.cluster}
                        type="button"
                        className="chip"
                        aria-pressed={active[s.cluster]}
                        onClick={() => toggle(s.cluster)}
                        style={{ ["--c" as string]: s.color }}
                    >
                        <i />
                        {s.name}
                    </button>
                ))}
            </div>
            <div className="chart" style={{ height: 420 }}>
                <ResponsiveContainer>
                    <ScatterChart margin={{ left: 0, right: 16, top: 8 }}>
                        <CartesianGrid stroke={GRID} />
                        <XAxis type="number" dataKey="recency" name="Recency (days)" stroke={AXIS} tickLine={false} />
                        <YAxis
                            type="number"
                            dataKey="monetary"
                            name="Monetary value"
                            stroke={AXIS}
                            scale="sqrt"
                            domain={[0, "auto"]}
                            tickFormatter={money}
                            tickLine={false}
                            axisLine={false}
                        />
                        <ZAxis type="number" dataKey="frequency" range={[24, 240]} name="Orders" />
                        <Tooltip
                            contentStyle={tooltipStyle}
                            itemStyle={tooltipText}
                            cursor={{ strokeDasharray: "3 3", stroke: "#cbd5e1" }}
                            formatter={(v, name) => (name === "Monetary value" ? `£${Number(v).toLocaleString()}` : Number(v).toLocaleString())}
                        />
                        {segments
                            .filter((s) => active[s.cluster])
                            .map((s) => (
                                <Scatter
                                    key={s.cluster}
                                    name={s.name}
                                    data={customers.filter((c) => c.cluster === s.cluster)}
                                    fill={s.color}
                                    fillOpacity={0.55}
                                    isAnimationActive={false}
                                />
                            ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
