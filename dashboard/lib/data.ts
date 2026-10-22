import fs from "fs";
import path from "path";

export type Customer = {
    id: number;
    recency: number;
    frequency: number;
    monetary: number;
    cluster: number;
};

export type SegmentInfo = {
    cluster: number;
    name: string;
    color: string;
    description: string;
    action: string;
};

// Cluster ids come from the notebook output. Names follow the project README.
export const SEGMENTS: SegmentInfo[] = [
    {
        cluster: 2,
        name: "High-Value Reseller",
        color: "#2f5d8a",
        description: "Very recent, highly frequent, high-spending core customers.",
        action: 'Launch a "Business Program" with bulk pricing and exclusive product previews.',
    },
    {
        cluster: 0,
        name: "Loyal Homemaker",
        color: "#5b8a72",
        description: "Largest group of consistent, moderately recent and frequent customers.",
        action: 'Introduce personalized "Smart Bundles" and a "Subscribe & Save" feature.',
    },
    {
        cluster: 1,
        name: "At-Risk Shopper",
        color: "#c08a3e",
        description: "Customers who have not purchased in a long time and are about to churn.",
        action: 'Run a targeted "Win-Back" campaign with personalized, limited-time offers.',
    },
    {
        cluster: 3,
        name: "Anomalous Shopper",
        color: "#a8514a",
        description: "Small, high-value outlier group with erratic buying patterns.",
        action: "Isolate and investigate for B2B opportunities or fraudulent activity.",
    },
];

export type SegmentStats = SegmentInfo & {
    count: number;
    countShare: number;
    revenue: number;
    revenueShare: number;
    avgRecency: number;
    avgFrequency: number;
    avgMonetary: number;
};

export type DashboardData = {
    totalCustomers: number;
    totalRevenue: number;
    avgRecency: number;
    avgFrequency: number;
    segments: SegmentStats[];
    customers: Customer[];
};

export function loadDashboardData(): DashboardData {
    const file = path.join(process.cwd(), "data", "customer_segments_final.csv");
    const lines = fs.readFileSync(file, "utf8").trim().split(/\r?\n/);
    const header = lines[0].split(",");
    const idx = (name: string) => header.indexOf(name);
    const [iId, iR, iF, iM, iC] = ["CustomerID", "Recency", "Frequency", "MonetaryValue", "Cluster"].map(idx);

    const customers: Customer[] = lines.slice(1).map((line) => {
        const c = line.split(",");
        return {
            id: Number(c[iId]),
            recency: Number(c[iR]),
            frequency: Number(c[iF]),
            monetary: Number(c[iM]),
            cluster: Number(c[iC]),
        };
    });

    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((s, c) => s + c.monetary, 0);
    const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    const segments: SegmentStats[] = SEGMENTS.map((info) => {
        const members = customers.filter((c) => c.cluster === info.cluster);
        const revenue = members.reduce((s, c) => s + c.monetary, 0);
        return {
            ...info,
            count: members.length,
            countShare: totalCustomers ? members.length / totalCustomers : 0,
            revenue,
            revenueShare: totalRevenue ? revenue / totalRevenue : 0,
            avgRecency: avg(members.map((c) => c.recency)),
            avgFrequency: avg(members.map((c) => c.frequency)),
            avgMonetary: avg(members.map((c) => c.monetary)),
        };
    });

    return {
        totalCustomers,
        totalRevenue,
        avgRecency: avg(customers.map((c) => c.recency)),
        avgFrequency: avg(customers.map((c) => c.frequency)),
        segments,
        customers,
    };
}
