import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { renderResumePdf } from "@/lib/resume-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const markdown = await readFile(join(process.cwd(), "content/resume.md"), "utf8");
  const pdf = renderResumePdf(markdown);

  return new Response(pdf, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Disposition": 'attachment; filename="Shawn_Daichendt_Resume.pdf"',
      "Content-Type": "application/pdf",
    },
  });
}
