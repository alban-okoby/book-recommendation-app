import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TableBook — Restaurant Reservations",
  description: "Discover and book tables at the best restaurants near you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[var(--color-canvas-soft)] text-[var(--color-ink)] antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
