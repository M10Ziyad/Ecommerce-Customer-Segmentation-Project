import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "E-commerce Customer Segmentation",
    description: "RFM + DBSCAN/K-Means customer segmentation dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
