"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  Star,
} from "lucide-react";
import { sortedContributions } from "@/data/contributions";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(iso: string) {
  const parsed = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : dateFormatter.format(parsed);
}

export default function Contributions() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollPrev(track.scrollLeft > 1);
    setCanScrollNext(track.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState]);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-carousel-card]");
    const step = card ? card.offsetWidth + 20 : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  if (sortedContributions.length === 0) return null;

  const navButtonClass =
    "flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-300 disabled:cursor-not-allowed";

  return (
    <section id="contributions" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Open source contributions
            </h2>
            <p className="text-gray-400 max-w-xl">
              Fixes and improvements I&apos;ve contributed upstream to projects
              I don&apos;t own. Every entry links straight to the pull request.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollPrev}
              aria-label="Previous contributions"
              className={navButtonClass}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canScrollNext}
              aria-label="Next contributions"
              className={navButtonClass}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="carousel-track flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {sortedContributions.map((contribution) => {
            const merged = contribution.merged;
            const formattedDate = formatDate(contribution.date);

            return (
              <div
                key={contribution.slug}
                data-carousel-card
                className="group snap-start shrink-0 w-[85vw] max-w-[26rem] md:w-[26rem] bg-white/3 hover:bg-white/6 border border-white/8 hover:border-cyan-500/30 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a
                      href={contribution.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors break-words"
                    >
                      {contribution.project}
                    </a>
                    <p className="text-cyan-400/70 text-sm mt-0.5 break-words">
                      {contribution.title}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${
                      merged
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {merged ? <GitMerge size={12} /> : <GitPullRequest size={12} />}
                    {merged ? "Merged" : "Open"}
                  </span>
                </div>

                {(contribution.stars || formattedDate) && (
                  <div className="flex items-center gap-4 text-xs text-gray-500 -mt-2">
                    {contribution.stars && (
                      <span className="flex items-center gap-1">
                        <Star size={12} />
                        {contribution.stars} stars
                      </span>
                    )}
                    {formattedDate && <span>{formattedDate}</span>}
                  </div>
                )}

                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {contribution.description}
                </p>

                {contribution.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {contribution.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-md border border-white/8"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                  <a
                    href={contribution.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <GitPullRequest size={14} />
                    View PR
                  </a>
                  {contribution.commitUrl && (
                    <a
                      href={contribution.commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <GitCommitHorizontal size={14} />
                      Commit
                    </a>
                  )}
                  {contribution.issueUrl && (
                    <a
                      href={contribution.issueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                      Issue
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
