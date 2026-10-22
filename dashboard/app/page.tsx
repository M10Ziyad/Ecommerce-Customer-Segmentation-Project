import { loadDashboardData } from "@/lib/data";
import { AvgMetricBar, CustomerSharePie, RevenueBar, RfmScatter } from "@/components/Charts";

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default function Page() {
    const d = loadDashboardData();
    const top = [...d.segments].sort((a, b) => b.revenueShare - a.revenueShare)[0];

    return (
        <main className="container">
            <h1>E-commerce Customer Segmentation</h1>
            <p className="subtitle">
                RFM analysis with hybrid DBSCAN + K-Means clustering. Silhouette score on core clusters: 0.7366.
            </p>

            <section className="grid kpis">
                <div className="card">
                    <div className="kpi-label">Customers</div>
                    <div className="kpi-value">{d.totalCustomers.toLocaleString()}</div>
                </div>
                <div className="card">
                    <div className="kpi-label">Total revenue</div>
                    <div className="kpi-value">{gbp(d.totalRevenue)}</div>
                </div>
                <div className="card">
                    <div className="kpi-label">Avg recency (days)</div>
                    <div className="kpi-value">{d.avgRecency.toFixed(0)}</div>
                </div>
                <div className="card">
                    <div className="kpi-label">Avg orders per customer</div>
                    <div className="kpi-value">{d.avgFrequency.toFixed(1)}</div>
                </div>
                <div className="card">
                    <div className="kpi-label">Top revenue segment</div>
                    <div className="kpi-value" style={{ fontSize: 20 }}>
                        {top.name}
                    </div>
                    <div className="kpi-label">{pct(top.revenueShare)} of revenue</div>
                </div>
            </section>

            <section className="grid two">
                <div className="card">
                    <h2>Customers by segment</h2>
                    <CustomerSharePie segments={d.segments} />
                </div>
                <div className="card">
                    <h2>Revenue by segment</h2>
                    <RevenueBar segments={d.segments} />
                </div>
            </section>

            <section className="grid two">
                <div className="card">
                    <h2>Average recency (days since last order)</h2>
                    <AvgMetricBar segments={d.segments} metric="avgRecency" label="Days" />
                </div>
                <div className="card">
                    <h2>Average orders per customer</h2>
                    <AvgMetricBar segments={d.segments} metric="avgFrequency" label="Orders" />
                </div>
            </section>

            <section className="card" style={{ marginBottom: 16 }}>
                <h2>Recency vs monetary value (bubble size = order count)</h2>
                <RfmScatter customers={d.customers} segments={d.segments} />
            </section>

            <section className="grid seg-cards">
                {d.segments.map((s) => (
                    <div className="card seg-card" key={s.cluster} style={{ borderTop: `3px solid ${s.color}` }}>
                        <h3>{s.name}</h3>
                        <p>{s.description}</p>
                        <p className="action">
                            <strong>Action:</strong> {s.action}
                        </p>
                    </div>
                ))}
            </section>

            <section className="card">
                <h2>Segment profile</h2>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Segment</th>
                                <th className="num">Customers</th>
                                <th className="num">% of customers</th>
                                <th className="num">Revenue</th>
                                <th className="num">% of revenue</th>
                                <th className="num">Avg recency</th>
                                <th className="num">Avg orders</th>
                                <th className="num">Avg spend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {d.segments.map((s) => (
                                <tr key={s.cluster}>
                                    <td>
                                        <span className="dot" style={{ background: s.color }} />
                                        {s.name}
                                    </td>
                                    <td className="num">{s.count.toLocaleString()}</td>
                                    <td className="num">{pct(s.countShare)}</td>
                                    <td className="num">{gbp(s.revenue)}</td>
                                    <td className="num">{pct(s.revenueShare)}</td>
                                    <td className="num">{s.avgRecency.toFixed(1)}</td>
                                    <td className="num">{s.avgFrequency.toFixed(1)}</td>
                                    <td className="num">{gbp(s.avgMonetary)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer>Data: UCI Online Retail dataset, 4,338 customers with a valid CustomerID.</footer>
        </main>
    );
}
