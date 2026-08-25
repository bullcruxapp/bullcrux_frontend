import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import AppShell from "../components/AppShell";

const sfPro = localFont({
  src: "../fonts/SF-Pro.ttf",
  variable: "--font-sf-pro",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bullcrux",
  description: "Rey del ticket ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sfPro.variable}>
        <SessionProviderWrapper>
          <AppShell>
            {children}
          </AppShell>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
