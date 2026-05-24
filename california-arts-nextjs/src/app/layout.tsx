import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điển",
  description: "Điển. Accessible design by producing less & building better.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/media/d-brandmark.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/media/d-brandmark.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Root layout is shared by (frontend) and (payload) groups.
  // Each group has its own layout that renders <html>/<body>.
  // This root layout just passes children through.
  return children as React.JSX.Element;
}
