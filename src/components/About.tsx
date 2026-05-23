import { MapPin, Calendar, Briefcase } from "lucide-react";

const highlights = [
  {
    icon: Calendar,
    label: "12+ years",
    detail: "writing code professionally",
  },
  {
    icon: Briefcase,
    label: "Enterprise → Indie",
    detail: "GM, Ford, and now my own thing",
  },
  {
    icon: MapPin,
    label: "Windsor/Detroit area",
    detail: "living and working locally, available remotely worldwide",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              A bit about me
            </h2>

            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                I got into development because I wanted to build things — not just write tickets.
                Over a decade later, that&apos;s still the reason I sit down at the keyboard.
              </p>
              <p>
                I&apos;ve shipped production software for some big names (GM, Ford) and spent just as
                much time building weird side projects that scratch my own itch — a language
                learning app, a prediction market tracker, a cosmic horror card game, a piano
                teacher for VR headsets. If the idea is interesting enough, I&apos;ll build it.
              </p>
              <p>
                I&apos;m most at home in the full stack: Next.js on the front, Node on the back,
                Supabase when I want to move fast. I also wander into game dev (Godot, Unity) and
                hardware (currently: AI appliances on Mac Minis).
              </p>
              <p>
                I&apos;m available for freelance contracts, consulting, and the right full-time role.
                If you&apos;ve got a hard problem and want someone who gives a damn about the details,
                let&apos;s talk.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="/Shawn_Daichendt_Resume_2026.pdf"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 px-4 py-2.5 rounded-lg transition-all duration-200"
              >
                Download résumé
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {highlights.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="flex items-center gap-5 bg-white/3 border border-white/8 rounded-2xl p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{label}</p>
                  <p className="text-gray-500 text-sm">{detail}</p>
                </div>
              </div>
            ))}

            <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mt-2">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
                Currently working on
              </p>
              <ul className="space-y-2">
                {[
                  "Adeso — AI appliance product",
                  "Threshold — cosmic horror deckbuilder",
                  "Piano AR — Meta Quest piano tutor",
                  "Odoo consulting for AMAP",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
