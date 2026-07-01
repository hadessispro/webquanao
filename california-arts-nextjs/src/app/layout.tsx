import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điển",
  description: "Điển. Accessible design by producing less & building better.",
  icons: {
    icon: [
      { url: "/icon.png?v=20260701b", type: "image/png" },
      { url: "/favicon.ico?v=20260701b" },
    ],
    shortcut: "/icon.png?v=20260701b",
    apple: "/apple-icon.png?v=20260701b",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Root layout is shared by (frontend) and (payload) groups.
  // Each group has its own layout that renders <html>/<body>.
  // This root layout just passes children through.
  return children as React.JSX.Element;
}
