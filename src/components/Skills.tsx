const skillGroups = [
  {
    label: "Frontend",
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Vue / Nuxt",
      "Tailwind CSS",
      "HTML / CSS",
    ],
  },
  {
    label: "Backend",
    skills: [
      "Node.js",
      "Fastify",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "REST & GraphQL",
    ],
  },
  {
    label: "Mobile & Game Dev",
    skills: ["Godot 4 / GDScript", "Unity 6 / C#", "Expo / React Native", "Meta XR SDK"],
  },
  {
    label: "DevOps & Cloud",
    skills: ["Vercel", "Fly.io", "Railway", "AWS EC2", "Docker", "GitHub Actions"],
  },
  {
    label: "Other",
    skills: ["Odoo", "Stripe", "Ollama / LLMs", "3D Printing / Fusion 360", "Figma"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What I work with
          </h2>
          <p className="text-gray-400 max-w-xl">
            Tools I reach for regularly — plus a few I picked up because a side project demanded it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.label}
              className="bg-white/3 border border-white/8 rounded-2xl p-6"
            >
              <h3 className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-4">
                {group.label}
              </h3>
              <ul className="space-y-2.5">
                {group.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2.5 text-gray-300 text-sm">
                    <span className="w-1 h-1 rounded-full bg-cyan-500/60 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
