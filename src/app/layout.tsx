import type { Metadata, Viewport } from "next";
import { DM_Sans, Libre_Baskerville } from "next/font/google";
import { SessionProvider } from "@/context/SessionContext";
import { HintsProvider } from "@/context/HintsContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Make · Buy · Partner | Technology Strategy Analysis",
  description: "An interactive tool for analyzing make-buy-partner decisions using strategic frameworks. Developed for Columbia Business School.",
  authors: [{ name: "Professor Dan Wang", url: "https://www.gsb.columbia.edu" }],
  keywords: ["technology strategy", "make buy partner", "MBA", "Columbia Business School", "strategic analysis"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1D4ED8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${libreBaskerville.variable} antialiased min-h-screen`}
      >
        {/* Skip link for keyboard navigation */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <HintsProvider>
          <SessionProvider>
            <TooltipProvider delayDuration={300}>
              <div className="flex flex-col min-h-screen">
                {children}
              </div>
            </TooltipProvider>
          </SessionProvider>
        </HintsProvider>
      </body>
    </html>
  );
}
