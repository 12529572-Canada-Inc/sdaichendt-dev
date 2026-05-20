import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shawn Daichendt — Full-Stack Developer & Indie Maker",
  description:
    "Toronto-based full-stack developer with 12+ years of experience. I build web apps, games, and creative projects. Available for freelance and consulting.",
  openGraph: {
    title: "Shawn Daichendt — Full-Stack Developer & Indie Maker",
    description:
      "Toronto-based full-stack developer with 12+ years of experience. Available for freelance and consulting.",
    url: "https://sdaichendt.dev",
    siteName: "sdaichendt.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shawn Daichendt — Full-Stack Developer & Indie Maker",
    description:
      "Toronto-based full-stack developer with 12+ years of experience. Available for freelance and consulting.",
  },
  metadataBase: new URL("https://sdaichendt.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
