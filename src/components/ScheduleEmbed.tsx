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

// Official Cal.com embed loader (https://cal.com/docs/embeds), adapted to TS.
function getCal(): CalFn {
  const w = window;
  if (w.Cal?.loaded) return w.Cal;

  const cal: CalFn = (...args: unknown[]) => {
    const api: CalFn = (...apiArgs: unknown[]) => {
      api.q?.push(apiArgs);
    };
    api.q = api.q ?? [];

    if (typeof args[0] === "string" && args[0] === "init" && typeof args[1] === "string") {
      // Namespaced init: Cal("init", "ns", {...})
      const namespace = args[1];
      cal.ns = cal.ns ?? {};
      if (!cal.ns[namespace]) {
        api.q.push(args.slice(2).length ? ["initNamespace", namespace, ...args.slice(2)] : ["initNamespace", namespace]);
        cal.ns[namespace] = api;
      }
      cal.q?.push(args);
      return;
    }
    cal.q?.push(args);
  };
  cal.q = cal.q ?? [];
  cal.ns = cal.ns ?? {};
  cal.loaded = true;
  w.Cal = cal;

  const script = document.createElement("script");
  script.src = "https://app.cal.com/embed/embed.js";
  script.async = true;
  document.head.appendChild(script);

  cal("init", { origin: "https://cal.com" });
  return cal;
}

export default function ScheduleEmbed() {
  const [active, setActive] = useState(meetingTypes[1] ?? meetingTypes[0]);

  useEffect(() => {
    const cal = getCal();
    const ns = active.slug;

    cal("init", ns, { origin: "https://cal.com" });
    const calNs = cal.ns?.[ns] ?? cal;

    calNs("inline", {
      elementOrSelector: `#cal-embed-${ns}`,
      calLink: `${CAL_USERNAME}/${active.slug}`,
      config: { layout: "month_view", theme: "dark" },
    });
    calNs("ui", {
      theme: "dark",
      cssVarsPerTheme: { dark: { "cal-brand": "#22d3ee" } },
      hideEventTypeDetails: false,
    });
  }, [active]);

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

      {/* Cal.com inline embed — keyed so each meeting type gets a fresh container */}
      <div
        key={active.slug}
        id={`cal-embed-${active.slug}`}
        className="min-h-[600px] w-full rounded-xl overflow-hidden"
      />

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
