import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaperMaxing",
  description: "Master any research paper with traceable claims and evidence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
