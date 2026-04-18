import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "California Arts™ — California Minimalism",
  description: "Accessible design by producing less & building better. West Coast alternative fashion from Southern California.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/pck3rmu.css" />
        <link rel="stylesheet" href="/css/theme.min.css" />
        <link rel="stylesheet" href="/css/global.min.css" />
      </head>
      <body id="california-arts" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
