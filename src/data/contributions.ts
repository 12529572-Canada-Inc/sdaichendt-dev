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
  /** ISO date (YYYY-MM-DD), used for sorting newest-first. */
  date: string;
}

export const contributions: Contribution[] = [
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

/** Newest contributions first. */
export const sortedContributions: Contribution[] = [...contributions].sort(
  (a, b) => b.date.localeCompare(a.date),
);
