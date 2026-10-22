import type { CSSProperties, ReactNode } from "react";
import { loadDashboardData } from "@/lib/data";
import { AvgMetricBar, CustomerSharePie, RevenueBar, RfmScatter, ShareComparison } from "@/components/Charts";

const REPO = "https://github.com/M10Ziyad/Ecommerce-Customer-Segmentation-Project";

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const pct = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`;
const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c });

const Icon = ({ children }: { children: ReactNode }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

function Kpi({ label, value, note, tint, icon }: { label: string; value: string; note?: string; tint: [string, string]; icon: ReactNode }) {
    return (
        <div className="card kpi">
            <div className="kpi-icon" style={{ background: tint[0], color: tint[1] }}>
                {icon}
            </div>
            <div>
                <div className="kpi-label">{label}</div>
                <div className="kpi-value">{value}</div>
                {note && <div className="kpi-note">{note}</div>}
            </div>
        </div>
    );
}

export default function Page() {
    const d = loadDashboardData();
    const byRevenue = [...d.segments].sort((a, b) => b.revenueShare - a.revenueShare);
    const top = d.segments.find((s) => s.name === "High-Value Reseller") ?? byRevenue[0];
    const atRisk = d.segments.find((s) => s.name === "At-Risk Shopper");
    const maxCount = Math.max(...d.segments.map((s) => s.count));
    const maxRevenue = Math.max(...d.segments.map((s) => s.revenue));

    return (
        <>
            <header className="topbar">
                <div className="topbar-inner">
                    <div className="brand">
                        <div className="brand-logo">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 3v18h18" />
                                <path d="M7 15l4-4 3 3 5-6" />
                            </svg>
                        </div>
                        Segmentation Studio
                    </div>
                    <nav className="topbar-links">
                        <a className="btn" href={REPO} target="_blank" rel="noreferrer">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                            </svg>
                            <span>GitHub</span>
                        </a>
                    </nav>
                </div>
            </header>

            <main className="container">
                <section className="hero">
                    <h1>Know which customers drive your revenue</h1>
                    <p>
                        Customers are grouped by how recently, how often and how much they buy (RFM), then clustered with a hybrid
                        DBSCAN and K-Means model.
                    </p>
                    <div className="pills">
                        <span className="pill">Silhouette score 0.7366</span>
                        <span className="pill">{d.totalCustomers.toLocaleString()} customers</span>
                        <span className="pill">UCI Online Retail dataset</span>
                    </div>
                </section>

                <div className="insight">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <div>
                        <strong>{top.name}s</strong> are only {pct(top.countShare)} of customers but bring in{" "}
                        <strong>{pct(top.revenueShare)}</strong> of revenue.
                        {atRisk && ` At-Risk Shoppers make up ${pct(atRisk.countShare)} of customers and need a win-back plan.`}
                    </div>
                </div>

                <section className="grid kpis">
                    <Kpi
                        label="Customers"
                        value={d.totalCustomers.toLocaleString()}
                        note="with a valid ID"
                        tint={["#eef2ff", "#4f46e5"]}
                        icon={
                            <Icon>
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </Icon>
                        }
                    />
                    <Kpi
                        label="Total revenue"
                        value={gbp(d.totalRevenue)}
                        note="all segments"
                        tint={["#ecfdf5", "#059669"]}
                        icon={
                            <Icon>
                                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </Icon>
                        }
                    />
                    <Kpi
                        label="Avg recency"
                        value={`${d.avgRecency.toFixed(0)} days`}
                        note="since last order"
                        tint={["#fffbeb", "#d97706"]}
                        icon={
                            <Icon>
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                            </Icon>
                        }
                    />
                    <Kpi
                        label="Avg orders"
                        value={d.avgFrequency.toFixed(1)}
                        note="per customer"
                        tint={["#fdf2f8", "#db2777"]}
                        icon={
                            <Icon>
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </Icon>
                        }
                    />
                </section>

                <h2 className="section-title">Segments</h2>
                <section className="grid seg-cards">
                    {byRevenue.map((s) => (
                        <div className="card seg-card" key={s.cluster} style={cvar(s.color)}>
                            <div className="seg-head">
                                <h3>{s.name}</h3>
                                <span className="badge">{pct(s.revenueShare, 0)} of revenue</span>
                            </div>
                            <p className="seg-desc">{s.description}</p>
                            <div className="seg-stats">
                                <div className="seg-stat">
                                    <div className="l">Customers</div>
                                    <div className="v">{s.count.toLocaleString()}</div>
                                </div>
                                <div className="seg-stat">
                                    <div className="l">Avg spend</div>
                                    <div className="v">{gbp(s.avgMonetary)}</div>
                                </div>
                                <div className="seg-stat">
                                    <div className="l">Avg recency</div>
                                    <div className="v">{s.avgRecency.toFixed(0)} days</div>
                                </div>
                                <div className="seg-stat">
                                    <div className="l">Avg orders</div>
                                    <div className="v">{s.avgFrequency.toFixed(1)}</div>
                                </div>
                            </div>
                            <div className="meter-label">
                                <span>Share of customers</span>
                                <span>{pct(s.countShare)}</span>
                            </div>
                            <div className="meter">
                                <span style={{ width: `${Math.max(s.countShare * 100, 1.5)}%` }} />
                            </div>
                            <div className="meter-label">
                                <span>Share of revenue</span>
                                <span>{pct(s.revenueShare)}</span>
                            </div>
                            <div className="meter">
                                <span style={{ width: `${Math.max(s.revenueShare * 100, 1.5)}%` }} />
                            </div>
                            <div className="action-box">
                                <b>Recommended action.</b> {s.action}
                            </div>
                        </div>
                    ))}
                </section>

                <h2 className="section-title">Overview</h2>
                <section className="grid two">
                    <div className="card">
                        <h2>Customers by segment</h2>
                        <p className="card-sub">How the customer base splits across segments.</p>
                        <CustomerSharePie segments={d.segments} />
                    </div>
                    <div className="card">
                        <h2>Revenue by segment</h2>
                        <p className="card-sub">Total spend per segment.</p>
                        <RevenueBar segments={d.segments} />
                    </div>
                </section>

                <section className="card" style={{ marginBottom: 16 }}>
                    <h2>Customers vs revenue</h2>
                    <p className="card-sub">A segment whose revenue share is above its customer share punches above its weight.</p>
                    <ShareComparison segments={d.segments} />
                </section>

                <h2 className="section-title">Behavior</h2>
                <section className="grid two">
                    <div className="card">
                        <h2>Average recency</h2>
                        <p className="card-sub">Days since last order. Lower is better.</p>
                        <AvgMetricBar segments={d.segments} metric="avgRecency" label="Days" />
                    </div>
                    <div className="card">
                        <h2>Average orders per customer</h2>
                        <p className="card-sub">Higher means more repeat purchases.</p>
                        <AvgMetricBar segments={d.segments} metric="avgFrequency" label="Orders" />
                    </div>
                </section>

                <section className="card" style={{ marginBottom: 16 }}>
                    <h2>Every customer: recency vs spend</h2>
                    <p className="card-sub">Bubble size shows order count. Click a segment to show or hide it.</p>
                    <RfmScatter customers={d.customers} segments={d.segments} />
                </section>

                <h2 className="section-title">Details</h2>
                <section className="card">
                    <h2>Segment profile</h2>
                    <p className="card-sub">Sorted by revenue.</p>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Segment</th>
                                    <th className="num">Customers</th>
                                    <th className="num">Revenue</th>
                                    <th className="num">Avg recency</th>
                                    <th className="num">Avg orders</th>
                                    <th className="num">Avg spend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byRevenue.map((s) => (
                                    <tr key={s.cluster} style={cvar(s.color)}>
                                        <td>
                                            <span className="dot" style={{ background: s.color }} />
                                            <strong>{s.name}</strong>
                                        </td>
                                        <td className="num">
                                            <div className="cell-bar">
                                                <span>
                                                    {s.count.toLocaleString()} <span style={{ color: "#64748b" }}>({pct(s.countShare)})</span>
                                                </span>
                                                <span className="mini">
                                                    <span style={{ width: `${(s.count / maxCount) * 100}%` }} />
                                                </span>
                                            </div>
                                        </td>
                                        <td className="num">
                                            <div className="cell-bar">
                                                <span>
                                                    {gbp(s.revenue)} <span style={{ color: "#64748b" }}>({pct(s.revenueShare)})</span>
                                                </span>
                                                <span className="mini">
                                                    <span style={{ width: `${(s.revenue / maxRevenue) * 100}%` }} />
                                                </span>
                                            </div>
                                        </td>
                                        <td className="num">{s.avgRecency.toFixed(1)} days</td>
                                        <td className="num">{s.avgFrequency.toFixed(1)}</td>
                                        <td className="num">{gbp(s.avgMonetary)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer>
                    Data: UCI Online Retail dataset. Source on{" "}
                    <a href={REPO} target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                    .
                </footer>
            </main>
        </>
    );
}
