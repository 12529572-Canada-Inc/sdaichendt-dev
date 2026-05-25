type ResumeBlock =
  | { type: "bullet"; text: string }
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "rule" }
  | { rows: SkillRow[]; type: "skills" };

type SkillRow = {
  category: string;
  technologies: string;
};

type FontKey = "bold" | "italic" | "regular";

type PdfPage = {
  operations: string[];
};

const pageWidth = 612;
const pageHeight = 792;
const marginX = 48;
const marginTop = 50;
const marginBottom = 48;
const contentWidth = pageWidth - marginX * 2;

export function renderResumePdf(markdown: string): ArrayBuffer {
  const blocks = parseResumeMarkdown(markdown);
  const pages: PdfPage[] = [{ operations: [] }];
  let page = pages[0];
  let y = pageHeight - marginTop;

  const newPage = () => {
    page = { operations: [] };
    pages.push(page);
    y = pageHeight - marginTop;
  };

  const ensureSpace = (height: number) => {
    if (y - height < marginBottom) {
      newPage();
    }
  };

  const drawText = (text: string, x: number, textY: number, size: number, font: FontKey) => {
    page.operations.push(
      `0.08 0.09 0.11 rg BT /${fontResource(font)} ${size} Tf 1 0 0 1 ${formatNumber(x)} ${formatNumber(
        textY,
      )} Tm ${pdfString(normalizePdfText(text))} Tj ET`,
    );
  };

  const drawRule = () => {
    page.operations.push(
      `0.72 0.77 0.82 RG 0.5 w ${marginX} ${formatNumber(y)} m ${pageWidth - marginX} ${formatNumber(
        y,
      )} l S`,
    );
  };

  for (const block of blocks) {
    if (block.type === "h1") {
      ensureSpace(38);
      drawText(block.text, marginX, y, 24, "bold");
      y -= 26;
      continue;
    }

    if (block.type === "h2") {
      ensureSpace(36);
      y -= 4;
      drawText(block.text.toUpperCase(), marginX, y, 13, "bold");
      y -= 17;
      continue;
    }

    if (block.type === "h3") {
      ensureSpace(34);
      y -= 3;
      drawText(block.text, marginX, y, 12, "bold");
      y -= 15;
      continue;
    }

    if (block.type === "paragraph") {
      const lines = wrapText(block.text, 9.4, contentWidth);
      const blockHeight = lines.length * 11.6 + 5;
      ensureSpace(blockHeight);

      for (const line of lines) {
        drawText(line, marginX, y, 9.4, "regular");
        y -= 11.6;
      }

      y -= 5;
      continue;
    }

    if (block.type === "bullet") {
      const lines = wrapText(block.text, 9.2, contentWidth - 20);
      const blockHeight = lines.length * 11.4 + 3;
      ensureSpace(blockHeight);
      drawText("-", marginX + 3, y, 9.2, "regular");

      for (const [index, line] of lines.entries()) {
        drawText(line, marginX + 18, y, 9.2, "regular");
        if (index < lines.length - 1) {
          y -= 11.4;
        }
      }

      y -= 14;
      continue;
    }

    if (block.type === "skills") {
      y -= 2;

      for (const row of block.rows) {
        const techX = marginX + 132;
        const techWidth = pageWidth - marginX - techX;
        const techLines = wrapText(row.technologies, 8.8, techWidth);
        const rowHeight = Math.max(1, techLines.length) * 10.8 + 3;
        ensureSpace(rowHeight);
        drawText(row.category, marginX, y, 8.8, "bold");

        for (const [index, line] of techLines.entries()) {
          drawText(line, techX, y - index * 10.8, 8.8, "regular");
        }

        y -= rowHeight;
      }

      y -= 7;
      continue;
    }

    if (block.type === "rule") {
      ensureSpace(22);
      y -= 4;
      drawRule();
      y -= 14;
    }
  }

  return buildPdf(pages);
}

function parseResumeMarkdown(markdown: string): ResumeBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ResumeBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const trimmed = lines[index].trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed === "---") {
      blocks.push({ type: "rule" });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      blocks.push({ text: stripMarkdown(trimmed.slice(2)), type: "h1" });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push({ text: stripMarkdown(trimmed.slice(3)), type: "h2" });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push({ text: stripMarkdown(trimmed.slice(4)), type: "h3" });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("|")) {
      const tableRows: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableRows.push(lines[index].trim());
        index += 1;
      }

      const rows = tableRows
        .map(parseTableRow)
        .filter((row): row is SkillRow => Boolean(row));

      if (rows.length > 0) {
        blocks.push({ rows, type: "skills" });
      }

      continue;
    }

    if (trimmed.startsWith("- ")) {
      blocks.push({ text: stripMarkdown(trimmed.slice(2)), type: "bullet" });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("**")) {
      blocks.push({ text: stripMarkdown(trimmed), type: "paragraph" });
      index += 1;
      continue;
    }

    const paragraph: string[] = [];

    while (index < lines.length) {
      const next = lines[index].trim();

      if (
        !next ||
        next === "---" ||
        next.startsWith("#") ||
        next.startsWith("|") ||
        next.startsWith("- ") ||
        next.startsWith("**")
      ) {
        break;
      }

      paragraph.push(next);
      index += 1;
    }

    if (paragraph.length > 0) {
      blocks.push({ text: stripMarkdown(paragraph.join(" ")), type: "paragraph" });
    }
  }

  return blocks;
}

function parseTableRow(row: string): SkillRow | null {
  const cells = row
    .split("|")
    .slice(1, -1)
    .map((cell) => stripMarkdown(cell.trim()));

  if (cells.length < 2 || cells[0] === "Category" || cells[0].startsWith("---")) {
    return null;
  }

  return {
    category: cells[0],
    technologies: cells[1],
  };
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .trim();
}

function wrapText(text: string, size: number, maxWidth: number): string[] {
  const words = normalizePdfText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (current && measureText(candidate, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}

function measureText(text: string, size: number): number {
  let units = 0;

  for (const char of text) {
    if (char === " ") {
      units += 0.28;
    } else if ("ilI.,;:'|!".includes(char)) {
      units += 0.25;
    } else if ("mwMW".includes(char)) {
      units += 0.82;
    } else if (char >= "A" && char <= "Z") {
      units += 0.62;
    } else {
      units += 0.5;
    }
  }

  return units * size;
}

function buildPdf(pages: PdfPage[]): ArrayBuffer {
  const objects: string[] = [
    "",
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>",
  ];

  const pageRefs: string[] = [];

  for (const page of pages) {
    const pageObjectId = objects.length;
    const contentObjectId = pageObjectId + 1;
    const stream = page.operations.join("\n");

    pageRefs.push(`${pageObjectId} 0 R`);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentObjectId} 0 R >>`,
    );
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  }

  objects[2] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${pageRefs.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let id = 1; id < objects.length; id += 1) {
    pdf += `${offsets[id].toString().padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = new TextEncoder().encode(pdf);

  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function fontResource(font: FontKey): string {
  if (font === "bold") {
    return "F2";
  }

  if (font === "italic") {
    return "F3";
  }

  return "F1";
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function normalizePdfText(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/·/g, ",")
    .replace(/→/g, "->")
    .replace(/[^\x20-\x7E]/g, "");
}

function pdfString(text: string): string {
  return `(${text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")})`;
}
