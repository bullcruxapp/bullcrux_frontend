import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import DesktopLayout from "../components/DesktopLayout/DesktopLayout";

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
          {/* Desktop layout (>= 1024px) */}
          <DesktopLayout>
            {children}
          </DesktopLayout>

          {/* Mobile layout (< 1024px) */}
          <div className="mobile-only-wrapper">
            <div className="app-container">
              {children}
              <NavbarWrapper />
            </div>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
