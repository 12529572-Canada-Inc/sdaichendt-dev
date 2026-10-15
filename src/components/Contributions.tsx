"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type FocusEvent,
} from "react";
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

/**
 * The track renders the list this many times so it can scroll endlessly.
 * The middle copy is the "real" one; the others are decorative clones that
 * let the user keep going in either direction while we quietly re-centre.
 */
const COPIES = 7;
const MIDDLE_COPY = Math.floor(COPIES / 2);
const CARD_GAP = 20; // matches `gap-5`
const SETTLE_DELAY_MS = 150;
/** How often the carousel advances on its own while nobody is touching it. */
const AUTO_ADVANCE_MS = 5000;
/** How long a manual interaction keeps auto-advance paused. */
const INTERACTION_COOLDOWN_MS = 8000;
/** How often the auto-advance deadline is checked. */
const TICK_MS = 250;
/** Fraction of the track that must be on screen for it to auto-advance. */
const IN_VIEW_THRESHOLD = 0.2;

export default function Contributions() {
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | null>(null);
  /** True while the pointer is over the cards or the prev/next buttons. */
  const hoveredRef = useRef(false);
  /** True while keyboard focus is inside the carousel or its controls. */
  const keyboardFocusRef = useRef(false);
  /** True while a meaningful part of the track is visible in the viewport. */
  const inViewRef = useRef(false);
  /** Earliest time the carousel may advance on its own again. */
  const nextAdvanceAtRef = useRef(0);

  /** Width of one full copy of the list, measured from the live DOM. */
  const copyWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.querySelector<HTMLElement>('[data-copy="0"]');
    const next = track.querySelector<HTMLElement>('[data-copy="1"]');
    return first && next ? next.offsetLeft - first.offsetLeft : 0;
  }, []);

  /**
   * Keep the scroll position inside the middle copy. Every copy is pixel
   * identical, so shifting by whole copy widths is invisible to the user.
   */
  const recentre = useCallback(() => {
    const track = trackRef.current;
    const width = copyWidth();
    if (!track || width === 0) return;
    const min = width * MIDDLE_COPY;
    const max = min + width;
    const current = track.scrollLeft;
    if (current >= min && current < max) return;
    const offset = ((current % width) + width) % width;
    track.scrollTo({ left: min + offset, behavior: "instant" });
  }, [copyWidth]);

  // Start on the middle copy before first paint so there is no visible jump.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const width = copyWidth();
    if (!track || width === 0) return;
    track.scrollTo({ left: width * MIDDLE_COPY, behavior: "instant" });
  }, [copyWidth]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const clearSettle = () => {
      if (settleTimer.current !== null) {
        window.clearTimeout(settleTimer.current);
        settleTimer.current = null;
      }
    };
    // `scrollend` is not available everywhere, so also debounce `scroll`.
    const onScroll = () => {
      clearSettle();
      settleTimer.current = window.setTimeout(recentre, SETTLE_DELAY_MS);
    };
    const onScrollEnd = () => {
      clearSettle();
      recentre();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("scrollend", onScrollEnd);
    const observer = new ResizeObserver(recentre);
    observer.observe(track);
    return () => {
      clearSettle();
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", onScrollEnd);
      observer.disconnect();
    };
  }, [recentre]);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-carousel-card]");
    const step = card ? card.offsetWidth + CARD_GAP : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  const markInteraction = useCallback(() => {
    nextAdvanceAtRef.current = Date.now() + INTERACTION_COOLDOWN_MS;
  }, []);

  // Auto-advance while idle. Programmatic scrolls also fire `scroll`, so
  // interaction is detected from input events rather than scroll position.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      // Cards are tall, so on short viewports the track is often only partly
      // on screen; only treat it as hidden once it is almost entirely out.
      { threshold: IN_VIEW_THRESHOLD },
    );
    observer.observe(track);

    // Vertical wheel events are the page scrolling past the carousel, not
    // the user scrolling it; only a horizontal wheel counts as interaction.
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) markInteraction();
    };
    const inputEvents = ["touchstart", "pointerdown", "keydown"] as const;
    track.addEventListener("wheel", onWheel, { passive: true });
    for (const type of inputEvents) {
      track.addEventListener(type, markInteraction, { passive: true });
    }

    nextAdvanceAtRef.current = Date.now() + AUTO_ADVANCE_MS;
    const timer = window.setInterval(() => {
      const now = Date.now();
      const blocked =
        reducedMotion.matches ||
        document.hidden ||
        !inViewRef.current ||
        hoveredRef.current ||
        keyboardFocusRef.current;
      if (blocked) {
        // Keep the deadline just ahead so that, once unblocked, the carousel
        // waits a full interval before moving instead of lurching at once.
        nextAdvanceAtRef.current = Math.max(
          nextAdvanceAtRef.current,
          now + AUTO_ADVANCE_MS,
        );
        return;
      }
      if (now < nextAdvanceAtRef.current) return;
      scrollByCard(1);
      nextAdvanceAtRef.current = now + AUTO_ADVANCE_MS;
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      track.removeEventListener("wheel", onWheel);
      for (const type of inputEvents) {
        track.removeEventListener(type, markInteraction);
      }
    };
  }, [markInteraction, scrollByCard]);

  const handleNav = (direction: -1 | 1) => {
    markInteraction();
    scrollByCard(direction);
  };

  const pauseHandlers = {
    onPointerEnter: () => {
      hoveredRef.current = true;
    },
    onPointerLeave: () => {
      hoveredRef.current = false;
    },
    // Mouse clicks focus buttons too, but only keyboard focus should hold
    // the carousel still; otherwise one click would pause it indefinitely.
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (event.target.matches(":focus-visible")) keyboardFocusRef.current = true;
    },
    onBlur: () => {
      keyboardFocusRef.current = false;
    },
  };

  if (sortedContributions.length === 0) return null;

  const navButtonClass =
    "flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white";

  const copies = Array.from({ length: COPIES }, (_, copy) => copy);

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
          <div className="flex items-center gap-2" {...pauseHandlers}>
            <button
              type="button"
              onClick={() => handleNav(-1)}
              aria-label="Previous contributions"
              className={navButtonClass}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => handleNav(1)}
              aria-label="Next contributions"
              className={navButtonClass}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          {...pauseHandlers}
          className="carousel-track flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {copies.flatMap((copy) =>
            sortedContributions.map((contribution) => {
              const merged = contribution.merged;
              const formattedDate = formatDate(contribution.date);
              const isClone = copy !== MIDDLE_COPY;
              const linkTabIndex = isClone ? -1 : undefined;

              return (
                <div
                  key={`${copy}-${contribution.slug}`}
                  data-carousel-card
                  data-copy={copy}
                  aria-hidden={isClone || undefined}
                  className="group snap-start shrink-0 w-[85vw] max-w-[26rem] md:w-[26rem] bg-white/3 hover:bg-white/6 border border-white/8 hover:border-cyan-500/30 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <a
                        href={contribution.projectUrl}
                        tabIndex={linkTabIndex}
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
                      tabIndex={linkTabIndex}
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
                        tabIndex={linkTabIndex}
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
                        tabIndex={linkTabIndex}
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
            }),
          )}
        </div>
      </div>
    </section>
  );
}
