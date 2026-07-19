"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { CAL_USERNAME, meetingTypes } from "@/data/scheduling";

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

type CalFn = {
  (...args: unknown[]): void;
  loaded?: boolean;
  ns?: Record<string, CalFn>;
  q?: unknown[];
};

// Faithful port of the official Cal.com embed loader (https://cal.com/docs/embeds).
function getCal(): CalFn {
  const w = window;
  if (w.Cal) return w.Cal;

  const push = (fn: CalFn, args: unknown) => {
    fn.q?.push(args);
  };

  const cal: CalFn = (...ar: unknown[]) => {
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q ?? [];
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      document.head.appendChild(script);
      cal.loaded = true;
    }
    if (ar[0] === "init") {
      const api: CalFn = (...apiArgs: unknown[]) => {
        push(api, apiArgs);
      };
      const namespace = ar[1];
      api.q = api.q ?? [];
      if (typeof namespace === "string") {
        cal.ns![namespace] = cal.ns![namespace] || api;
        push(cal.ns![namespace], ar);
        push(cal, ["initNamespace", namespace]);
      } else {
        push(cal, ar);
      }
      return;
    }
    push(cal, ar);
  };

  w.Cal = cal;
  return cal;
}

export default function ScheduleEmbed() {
  const [active, setActive] = useState(meetingTypes[1] ?? meetingTypes[0]);

  // Initialize every meeting type's embed once on mount.
  useEffect(() => {
    const cal = getCal();
    for (const mt of meetingTypes) {
      cal("init", mt.slug, { origin: "https://cal.com" });
      const calNs = cal.ns?.[mt.slug];
      if (!calNs) continue;
      calNs("inline", {
        elementOrSelector: `#cal-embed-${mt.slug}`,
        calLink: `${CAL_USERNAME}/${mt.slug}`,
        config: { layout: "month_view", theme: "dark" },
      });
      calNs("ui", {
        theme: "dark",
        cssVarsPerTheme: { dark: { "cal-brand": "#22d3ee" } },
        hideEventTypeDetails: false,
      });
    }
  }, []);

  return (
    <div>
      {/* Meeting type selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10" role="tablist" aria-label="Meeting type">
        {meetingTypes.map((mt) => {
          const selected = mt.slug === active.slug;
          return (
            <button
              key={mt.slug}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(mt)}
              className={`text-left rounded-xl border p-4 transition-all duration-200 ${
                selected
                  ? "border-cyan-500/60 bg-cyan-500/10"
                  : "border-white/8 bg-white/3 hover:bg-white/6 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-cyan-400 shrink-0" />
                <span className="text-white text-sm font-medium">{mt.title}</span>
                <span className="text-gray-500 text-xs ml-auto">{mt.duration} min</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">{mt.description}</p>
            </button>
          );
        })}
      </div>

      {/* One pre-initialized Cal.com inline embed per meeting type; only the active one is visible */}
      {meetingTypes.map((mt) => (
        <div
          key={mt.slug}
          id={`cal-embed-${mt.slug}`}
          className={`min-h-[600px] w-full rounded-xl overflow-hidden ${
            mt.slug === active.slug ? "" : "hidden"
          }`}
        />
      ))}

      <p className="text-gray-600 text-xs mt-6 text-center">
        Times shown in your local timezone. Availability is weekdays after 10am ET.
        Trouble booking? Email{" "}
        <a href="mailto:hello@sdaichendt.dev" className="text-gray-500 hover:text-cyan-400 transition-colors underline">
          hello@sdaichendt.dev
        </a>
        .
      </p>
    </div>
  );
}
