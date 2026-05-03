import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uvesentlig",
  description: "Leon — helt uvesentlig siden 1980.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
