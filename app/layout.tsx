import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northstar | AI transformation studio",
  description: "A decision-grade AI consulting workbench for strategy, architecture, governance and delivery.",
  applicationName: "Northstar Transformation Studio",
  authors: [{ name: "Pablo Williams" }],
  robots: { index: true, follow: true },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#111a16", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
