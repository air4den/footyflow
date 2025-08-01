import type { Metadata } from "next";
import "./globals.css";
// import Head from "next/head";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import NavMenu from "@/components/NavMenu";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "JogaFlo",
  description: "Convert Strava activities into football heatmaps. ",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>  
          <header className="sticky top-0 z-50">
            <NavMenu />
          </header>
          <main className="relative">
            {children}
          </main>
          <footer className="w-full mt-4" style={{ padding: '2.5rem 0', backgroundColor: '#f5f5f5' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <p className="text-sm text-center">
                  © 2025 JogaFlo. Built with 🧡 by <a href="https://joshforden.com" className="text-strorange hover:text-orange-700 hover:text-opacity-80">Josh Forden</a>.
                </p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
