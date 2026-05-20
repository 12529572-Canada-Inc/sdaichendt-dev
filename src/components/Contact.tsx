"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

const socials = [
  {
    label: "GitHub",
    handle: "@djedi-knight",
    href: "https://github.com/djedi-knight",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    handle: "Shawn Daichendt",
    href: "https://www.linkedin.com/in/sdaichendt",
    icon: LinkedinIcon,
  },
  {
    label: "Email",
    handle: "sdaichendt@adeso.ai",
    href: "mailto:sdaichendt@adeso.ai",
    icon: Mail,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Sends via mailto as a fallback until a backend form handler is wired up
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:sdaichendt@adeso.ai?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    }, 500);
  };

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get in touch
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Whether you&apos;ve got a project in mind, want to hire me, or just want to talk shop —
            my inbox is open.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Message</label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="What are you working on?"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 text-sm outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <Send size={15} />
              {status === "sent" ? "Message opened!" : status === "sending" ? "Opening..." : "Send message"}
            </button>
          </form>

          {/* Social links */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-6">Or find me here</p>
            {socials.map(({ label, handle, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/3 hover:bg-white/6 border border-white/8 hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium group-hover:text-cyan-300 transition-colors">
                    {label}
                  </p>
                  <p className="text-gray-500 text-xs">{handle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
