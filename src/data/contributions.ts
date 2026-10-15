export interface Contribution {
  slug: string;
  /** Repo in `owner/name` form, e.g. "open-webui/open-webui". */
  project: string;
  projectUrl: string;
  /** PR title. */
  title: string;
  prUrl: string;
  /** Merged commit, when the PR landed as an identifiable commit. */
  commitUrl?: string;
  /** Issue the contribution closes, when there is one. */
  issueUrl?: string;
  description: string;
  tech: string[];
  /** Human-readable star count of the upstream repo, e.g. "148k". */
  stars?: string;
  merged: boolean;
  /**
   * ISO date (YYYY-MM-DD) used for sorting: the merge date for merged work,
   * the date opened for PRs still in review.
   */
  date: string;
}

export const contributions: Contribution[] = [
  {
    slug: "grafana-k6-6238",
    project: "grafana/k6",
    projectUrl: "https://github.com/grafana/k6",
    title:
      "Fix urlencoded form bodies encoding null as <nil> and objects as map[...]",
    prUrl: "https://github.com/grafana/k6/pull/6238",
    commitUrl:
      "https://github.com/grafana/k6/commit/bc073660bd0aec749d2a152a4951657854ebb918",
    issueUrl: "https://github.com/grafana/k6/issues/1185",
    description:
      "Fixed how k6 serialises JavaScript values into application/x-www-form-urlencoded request bodies. null and undefined now encode as empty values (key=) to match Node's querystring and jQuery, instead of the literal string <nil>, and nested objects and arrays log a warning rather than leaking Go's map[...] representation into the wire format. Backwards compatible — only the encoded output changes.",
    tech: ["Go", "JavaScript", "HTTP", "k6"],
    stars: "31k",
    merged: true,
    date: "2026-08-13",
  },
  {
    slug: "grafana-k6-6249",
    project: "grafana/k6",
    projectUrl: "https://github.com/grafana/k6",
    title:
      "Test gRPC proto loading with server and client in separate processes",
    prUrl: "https://github.com/grafana/k6/pull/6249",
    commitUrl:
      "https://github.com/grafana/k6/commit/5aa229a66ee434b823b915633460a8a06181c475",
    issueUrl: "https://github.com/grafana/k6/issues/3552",
    description:
      "k6's gRPC tests ran the server and client in one process, and because protobuf uses a process-global type registry the client could resolve server types without ever loading a .proto file — so the tests meant to cover runtime proto loading never exercised it. Added a gRPC E2E GitHub Actions workflow that builds k6 and the example gRPC server, runs them as separate OS processes, and executes every gRPC example script (unary, streaming, reflection, health checks) against it, failing on wrong server-computed replies, logged errors or failed checks. Also fixed a broken default proto path in the client-streaming example.",
    tech: ["Go", "gRPC", "Protocol Buffers", "GitHub Actions", "k6"],
    stars: "31k",
    merged: true,
    date: "2026-10-15",
  },
  {
    slug: "open-webui-27571",
    project: "open-webui/open-webui",
    projectUrl: "https://github.com/open-webui/open-webui",
    title:
      "fix: prevent duplicate users in concurrent trusted-header sign-in",
    prUrl: "https://github.com/open-webui/open-webui/pull/27571",
    commitUrl:
      "https://github.com/open-webui/open-webui/commit/50e050e1957de40caa9df479b4c0d9b814f1f623",
    issueUrl: "https://github.com/open-webui/open-webui/issues/27117",
    description:
      "Fixed a race condition where concurrent trusted-header sign-ins for the same new email created duplicate user and auth rows. Added a unique normalized-email index via an idempotent Alembic migration and made the get-or-create path atomic — losers of the create race roll back and re-authenticate, so every concurrent request resolves to a single account.",
    tech: ["Python", "SQLAlchemy", "Alembic", "PostgreSQL", "SQLite"],
    stars: "148k",
    merged: true,
    date: "2026-08-02",
  },
];

/** Newest contributions first; merged work leads within the same date. */
export const sortedContributions: Contribution[] = [...contributions].sort(
  (a, b) =>
    b.date.localeCompare(a.date) || Number(b.merged) - Number(a.merged),
);
