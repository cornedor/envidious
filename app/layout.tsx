import type { Metadata } from "next";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import clsx from "clsx";
import { inter } from "@/components/fonts";

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
    <html lang="en" className={inter.className}>
      <body className="selection:bg-teal-400 dark:bg-slate-700 dark:selection:bg-teal-600">
        {children}
      </body>
    </html>
  );
}
