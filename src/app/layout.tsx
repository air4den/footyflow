import type { Metadata } from "next";
import "./globals.css";

import { getServerSession } from "next-auth";
import SessionProvider from "./components/SessionProvider";
import NavMenu from "./components/NavMenu";
export const metadata: Metadata = {
  title: "FootyFlow",
  description: "Convert Strava activities into football heatmaps. ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

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
        </SessionProvider>
      </body>
    </html>
  );
}
