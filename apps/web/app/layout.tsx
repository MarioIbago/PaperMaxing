import type { Metadata } from "next";
import "./globals.css";
import "./functional.css";
import "./neo-greek.css";

export const metadata: Metadata = {
  title: "PaperMaxing",
  description: "Read research papers with local caching, pluggable model providers, and explicit grounding.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
