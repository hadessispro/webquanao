import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "California Arts™ — California Minimalism",
  description: "Accessible design by producing less & building better.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Root layout is shared by (frontend) and (payload) groups.
  // Each group has its own layout that renders <html>/<body>.
  // This root layout just passes children through.
  return children as React.JSX.Element;
}
