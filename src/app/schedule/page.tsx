import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScheduleEmbed from "@/components/ScheduleEmbed";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Book a call — Shawn Daichendt",
  description:
    "Book time with Shawn Daichendt directly — a 15-minute quick chat, 30-minute intro call, or 60-minute deep dive. No back-and-forth required.",
  openGraph: {
    title: "Book a call — Shawn Daichendt",
    description:
      "Book time with Shawn directly — quick chat, intro call, or deep dive. No back-and-forth required.",
    url: "https://sdaichendt.dev/schedule",
    siteName: "sdaichendt.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a call — Shawn Daichendt",
    description:
      "Book time with Shawn directly — quick chat, intro call, or deep dive. No back-and-forth required.",
  },
};

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white flex flex-col">
      <header className="max-w-6xl mx-auto w-full px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-white hover:text-cyan-400 transition-colors"
        >
          sd<span className="text-cyan-400">.</span>dev
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to site
        </Link>
      </header>

      <main className="flex-1 px-6 py-12 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-10 text-center">
            <p className="text-cyan-400 text-sm font-mono mb-4 tracking-widest uppercase">
              Schedule
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Book a call</h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Pick a meeting type and a time that works for you — no back-and-forth emails needed.
            </p>
          </div>

          <ScheduleEmbed />
        </div>
      </main>

      <Footer />
    </div>
  );
}
