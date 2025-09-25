import type { Metadata } from "next";
import { Luxurious_Script } from "next/font/google";
import "./globals.css";
import { PricingProvider } from "../contexts/PricingContext";
import { MerchandiseProvider } from "../contexts/MerchandiseContext";
import { UnifiedCartProvider } from "../contexts/UnifiedCartContext";
import { AdminAuthProvider } from "../contexts/AdminAuthContext";
import { SimulationProvider } from "../contexts/SimulationContext";

const luxuriousScript = Luxurious_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-luxurious-script",
});

export const metadata: Metadata = {
  title: "Give Back Ticketing Platform",
  description: "Fair tickets, real impact. A modern ticketing platform where every purchase supports the causes you care about.",
  keywords: ["tickets", "charity", "events", "concerts", "giving back"],
  authors: [{ name: "Give Back Ticketing Platform" }],
  openGraph: {
    title: "Give Back Ticketing Platform",
    description: "Fair tickets, real impact. Experience transparent pricing and meaningful impact.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${luxuriousScript.variable} font-sans antialiased bg-background text-foreground`}>
        <AdminAuthProvider>
          <SimulationProvider>
            <PricingProvider>
              <MerchandiseProvider>
                <UnifiedCartProvider>
                  <div className="min-h-screen">
                    {children}
                  </div>
                </UnifiedCartProvider>
              </MerchandiseProvider>
            </PricingProvider>
          </SimulationProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
