import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flotilla — Event Contracts Portfolio Manager",
  description: "DreamDEX lets you trade Event Contracts. Flotilla manages the book.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
