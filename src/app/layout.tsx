import type { Metadata } from "next";
import { Cinzel_Decorative, Montserrat } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel_Decorative({
  variable: "--font-celtic",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unhada.life | Celtic Healing & Biohacking",
  description: "A sanctuary for urban fairies. Discover the balance between deep psychology, ancestral nutrition, and the energy of the stars.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
