import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Schedule Assistant",
  description: "Auto-scheduling app for high school students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 min-h-screen font-sans">
        <AppProvider>
          <Navigation />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
