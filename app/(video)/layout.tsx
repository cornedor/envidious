import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Envidious",
  description: "Next.JS frontend for Invidious",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-300">
      <main className="min-h-screen bg-slate-50 dark:bg-slate-700">
        {children}
      </main>
    </div>
  );
}
