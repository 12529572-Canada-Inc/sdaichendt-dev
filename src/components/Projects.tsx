"use client";

import { useState } from "react";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { projects, categories, type ProjectCategory } from "@/data/projects";

const statusColors: Record<string, string> = {
  live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  beta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "early-signup": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "in-progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusLabels: Record<string, string> = {
  live: "Live",
  beta: "Beta",
  "early-signup": "Early Signup",
  "in-progress": "In Progress",
  shipped: "Shipped",
};

export default function Projects() {
  const [active, setActive] = useState<ProjectCategory>("all");

  const filtered =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Things I&apos;ve built
          </h2>
          <p className="text-gray-400 max-w-xl">
            A mix of commercial apps, games, and creative side projects. Some are live, some are works in progress — all of them taught me something.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active === c.id
                  ? "bg-cyan-500 text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <div
              key={project.slug}
              className="group bg-white/3 hover:bg-white/6 border border-white/8 hover:border-cyan-500/30 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-cyan-400/70 text-sm mt-0.5">{project.tagline}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${statusColors[project.status]}`}
                >
                  {statusLabels[project.status]}
                </span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-md border border-white/8"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {(project.links.live || project.links.store) && (
                <div className="flex items-center gap-3 pt-1">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink size={14} />
                      Visit
                    </a>
                  )}
                  {project.links.store && (
                    <a
                      href={project.links.store}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <ShoppingBag size={14} />
                      Shop
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
