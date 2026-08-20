import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baby Map - Live Global Births",
  description: "Flashes every time a baby is born in that country",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}