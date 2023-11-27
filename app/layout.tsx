import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import clsx from "clsx";

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
    <html lang="en">
      <body
        className={clsx(
          inter.className,
          "selection:bg-teal-400 dark:bg-slate-700 dark:selection:bg-teal-600",
        )}
      >
        {children}
      </body>
    </html>
  );
}
