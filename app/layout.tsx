import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./lib/store";
import Header from "./components/Header";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Kaapi Store",
  description: "AI tools for social sector workers. Pay per use, start free.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 antialiased">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
