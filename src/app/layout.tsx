// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

import localFont from "next/font/local";
import { CINEMATIC_BG } from "@/lib/theme";

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Kerolos - Creative Portfolio",
  description: "Premium portfolio showcasing creative work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-black`}>
      <head>
        {/* Critical CSS للخلفية السوداء فوراً */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background-color: #000000 !important;
              margin: 0;
              padding: 0;
              min-height: 100vh;
            }
            
            /* الخلفية السينمائية الثابتة */
            body::before {
              content: '';
              position: fixed;
              inset: 0;
              background-color: #000000;
              background-image: ${CINEMATIC_BG};
              z-index: -1;
              pointer-events: none;
            }
            
            /* منع أي فلاش أبيض */
            *:not(img):not(svg):not(video) {
              background-color: transparent;
            }
          `
        }} />
      </head>
      <body className="bg-black font-sans antialiased">
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}