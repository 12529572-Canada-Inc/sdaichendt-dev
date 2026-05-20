import { ArrowDown } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

function SubstackIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden px-6">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">
          <p className="text-cyan-400 text-sm font-mono mb-4 tracking-widest uppercase">
            Hey, I&apos;m Shawn 👋
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            I build things
            <br />
            <span className="text-cyan-400">that matter.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Full-stack developer and indie maker based in Toronto. 12+ years shipping software — from
            enterprise platforms at GM and Ford to scrappy side projects I can&apos;t stop thinking
            about. I love the whole thing: the messy idea, the late-night debug session, and the
            moment it finally clicks.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="border border-white/20 hover:border-cyan-400/50 text-white hover:text-cyan-300 font-semibold px-6 py-3 rounded-lg transition-all duration-200"
            >
              Let&apos;s talk
            </a>
          </div>

          <div className="flex items-center gap-5 mt-10">
            <a
              href="https://github.com/djedi-knight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/sdaichendt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href="https://open.substack.com/pub/sdaichendt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="Substack"
            >
              <SubstackIcon size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-600">
        <ArrowDown size={20} />
      </div>
    </section>
  );
}
