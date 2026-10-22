import type { CSSProperties } from "react";
import { loadDashboardData } from "@/lib/data";
import { AvgMetricBar, CustomerSharePie, RevenueBar, RfmScatter, ShareComparison } from "@/components/Charts";

const REPO = "https://github.com/M10Ziyad/Ecommerce-Customer-Segmentation-Project";

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const pct = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`;
const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c });

export default function Page() {
    const d = loadDashboardData();
    const byRevenue = [...d.segments].sort((a, b) => b.revenueShare - a.revenueShare);
    const top = d.segments.find((s) => s.name === "High-Value Reseller") ?? byRevenue[0];
    const atRisk = d.segments.find((s) => s.name === "At-Risk Shopper");

    return (
        <>
            <header className="topbar">
                <div className="topbar-inner">
                    <div className="brand">Customer Segmentation</div>
                    <a href={REPO} target="_blank" rel="noreferrer">
                        Source on GitHub
                    </a>
                </div>
            </header>

            <main className="container">
                <section className="hero">
                    <h1>Which customers drive revenue</h1>
                    <p className="lead">
                        {top.name}s are {pct(top.countShare)} of customers and bring in {pct(top.revenueShare)} of revenue.
                        {atRisk && ` At-Risk Shoppers are ${pct(atRisk.countShare)} of customers and have not bought in a long time.`}
                    </p>
                    <p className="meta">
                        {d.totalCustomers.toLocaleString()} customers · UCI Online Retail dataset · RFM with DBSCAN and K-Means ·
                        silhouette score 0.7366
                    </p>
                </section>

                <section className="kpis">
                    <div className="kpi">
                        <div className="kpi-label">Customers</div>
                        <div className="kpi-value">{d.totalCustomers.toLocaleString()}</div>
                        <div className="kpi-note">with a valid ID</div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-label">Total revenue</div>
                        <div className="kpi-value">{gbp(d.totalRevenue)}</div>
                        <div className="kpi-note">all segments</div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-label">Average recency</div>
                        <div className="kpi-value">{d.avgRecency.toFixed(0)} days</div>
                        <div className="kpi-note">since last order</div>
                    </div>
                    <div className="kpi">
                        <div className="kpi-label">Average orders</div>
                        <div className="kpi-value">{d.avgFrequency.toFixed(1)}</div>
                        <div className="kpi-note">per customer</div>
                    </div>
                </section>

                <h2 className="section">Segments</h2>
                <section className="seg-list">
                    {byRevenue.map((s) => (
                        <article className="seg" key={s.cluster} style={cvar(s.color)}>
                            <div>
                                <h3>
                                    <span className="dot" style={{ background: s.color }} />
                                    {s.name}
                                </h3>
                                <p className="seg-desc">{s.description}</p>
                                <p className="seg-action">
                                    <b>Recommended action:</b> {s.action}
                                </p>
                            </div>
                            <dl className="seg-stats">
                                <div>
                                    <dt>Customers</dt>
                                    <dd>
                                        {s.count.toLocaleString()}
                                        <small>{pct(s.countShare)}</small>
                                    </dd>
                                </div>
                                <div>
                                    <dt>Revenue</dt>
                                    <dd>
                                        {gbp(s.revenue)}
                                        <small>{pct(s.revenueShare)}</small>
                                    </dd>
                                </div>
                                <div>
                                    <dt>Avg spend</dt>
                                    <dd>{gbp(s.avgMonetary)}</dd>
                                </div>
                                <div>
                                    <dt>Avg recency</dt>
                                    <dd>{s.avgRecency.toFixed(0)} days</dd>
                                </div>
                                <div>
                                    <dt>Avg orders</dt>
                                    <dd>{s.avgFrequency.toFixed(1)}</dd>
                                </div>
                            </dl>
                        </article>
                    ))}
                </section>

                <h2 className="section">Size and revenue</h2>
                <section className="grid two">
                    <div className="card">
                        <h3 className="title">Customers by segment</h3>
                        <p className="card-sub">How the customer base splits.</p>
                        <CustomerSharePie segments={d.segments} />
                    </div>
                    <div className="card">
                        <h3 className="title">Revenue by segment</h3>
                        <p className="card-sub">Total spend per segment.</p>
                        <RevenueBar segments={d.segments} />
                    </div>
                </section>
                <section className="card">
                    <h3 className="title">Share of customers vs share of revenue</h3>
                    <p className="card-sub">A segment with a taller revenue bar than customer bar earns more than its size suggests.</p>
                    <ShareComparison segments={d.segments} />
                </section>

                <h2 className="section">Buying behavior</h2>
                <section className="grid two">
                    <div className="card">
                        <h3 className="title">Average recency</h3>
                        <p className="card-sub">Days since last order. Lower is better.</p>
                        <AvgMetricBar segments={d.segments} metric="avgRecency" label="Days" />
                    </div>
                    <div className="card">
                        <h3 className="title">Average orders per customer</h3>
                        <p className="card-sub">Higher means more repeat purchases.</p>
                        <AvgMetricBar segments={d.segments} metric="avgFrequency" label="Orders" />
                    </div>
                </section>
                <section className="card">
                    <h3 className="title">Every customer: recency vs spend</h3>
                    <p className="card-sub">Bubble size shows order count. Click a segment to show or hide it.</p>
                    <RfmScatter customers={d.customers} segments={d.segments} />
                </section>

                <footer>
                    Data: UCI Online Retail dataset.{" "}
                    <a href={REPO} target="_blank" rel="noreferrer">
                        Source code
                    </a>
                    .
                </footer>
            </main>
        </>
    );
}
