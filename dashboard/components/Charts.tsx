"use client";

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

const AXIS = "#8a96b2";
const GRID = "#243049";
const tooltipStyle = {
    background: "#131a2e",
    border: "1px solid #243049",
    borderRadius: 8,
    color: "#e6eaf5",
};

const money = (n: number) =>
    n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `£${(n / 1000).toFixed(0)}k` : `£${n.toFixed(0)}`;

export function CustomerSharePie({ segments }: { segments: SegmentStats[] }) {
    const data = segments.map((s) => ({ name: s.name, value: s.count, color: s.color }));
    return (
        <div className="chart">
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={105} paddingAngle={2} stroke="none">
                        {data.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#e6eaf5" }} formatter={(v) => Number(v).toLocaleString()} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function RevenueBar({ segments }: { segments: SegmentStats[] }) {
    const data = segments.map((s) => ({ name: s.name, revenue: Math.round(s.revenue), color: s.color }));
    return (
        <div className="chart">
            <ResponsiveContainer>
                <BarChart data={data} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid stroke={GRID} vertical={false} />
                    <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 12 }} interval={0} />
                    <YAxis stroke={AXIS} tickFormatter={money} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: "#e6eaf5" }}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        formatter={(v) => [`£${Number(v).toLocaleString()}`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                        {data.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                        ))}
                    </Bar>
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
    const data = segments.map((s) => ({ name: s.name, value: Number(s[metric].toFixed(1)), color: s.color }));
    return (
        <div className="chart">
            <ResponsiveContainer>
                <BarChart data={data} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid stroke={GRID} vertical={false} />
                    <XAxis dataKey="name" stroke={AXIS} tick={{ fontSize: 12 }} interval={0} />
                    <YAxis stroke={AXIS} />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: "#e6eaf5" }}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        formatter={(v) => [`${prefix}${Number(v).toLocaleString()}`, label]}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
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
    return (
        <div className="chart" style={{ height: 420 }}>
            <ResponsiveContainer>
                <ScatterChart margin={{ left: 8, right: 16, top: 8 }}>
                    <CartesianGrid stroke={GRID} />
                    <XAxis type="number" dataKey="recency" name="Recency (days)" stroke={AXIS} />
                    <YAxis
                        type="number"
                        dataKey="monetary"
                        name="Monetary value"
                        stroke={AXIS}
                        scale="sqrt"
                        domain={[0, "auto"]}
                        tickFormatter={money}
                    />
                    <ZAxis type="number" dataKey="frequency" range={[20, 220]} name="Orders" />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: "#e6eaf5" }}
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(v, name) => (name === "Monetary value" ? `£${Number(v).toLocaleString()}` : Number(v).toLocaleString())}
                    />
                    <Legend />
                    {segments.map((s) => (
                        <Scatter
                            key={s.cluster}
                            name={s.name}
                            data={customers.filter((c) => c.cluster === s.cluster)}
                            fill={s.color}
                            fillOpacity={0.6}
                            isAnimationActive={false}
                        />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
