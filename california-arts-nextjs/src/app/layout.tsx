import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "California Arts™ — California Minimalism",
  description: "Accessible design by producing less & building better. West Coast alternative fashion from Southern California.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="js" lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/pck3rmu.css" />
        <link rel="stylesheet" href="/css/component.css" />
        <link rel="stylesheet" href="/css/theme.min.css" />
      </head>
      <body id="california-arts" suppressHydrationWarning style={{ margin: 0, overflowX: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
