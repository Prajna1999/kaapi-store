import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./lib/store";
import Sidebar from "./components/Sidebar";
import TopRight from "./components/TopRight";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Kaapi Store",
  description: "AI tools for social sector workers. Pay per use, start free.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-stone-50 text-stone-900 antialiased">
        <StoreProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-w-0">{children}</main>
            <TopRight />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
