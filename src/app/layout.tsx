import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavbarComponent from "../components/NavbarComponent";
import SessionProviderWrapper from "../components/SessionProviderWrapper";

// Configuración de fuente SF-Pro
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
          {children}
          <NavbarComponent />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
