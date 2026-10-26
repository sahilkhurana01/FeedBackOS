export interface ParsedFeedbackRow {
  content: string;
  rating: number;
  authorName?: string;
  source: string;
}

export function parseCSVFeedback(csvContent: string): ParsedFeedbackRow[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const contentIdx = headers.findIndex((h) =>
    ["content", "review", "feedback", "comment", "text"].some((k) => h.includes(k))
  );
  const ratingIdx = headers.findIndex((h) =>
    ["rating", "stars", "score"].some((k) => h.includes(k))
  );
  const authorIdx = headers.findIndex((h) =>
    ["author", "name", "customer", "user"].some((k) => h.includes(k))
  );
  const sourceIdx = headers.findIndex((h) =>
    ["source", "platform", "channel"].some((k) => h.includes(k))
  );

  const results: ParsedFeedbackRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const rawContent = contentIdx !== -1 ? row[contentIdx] : row[0];

    if (!rawContent || !rawContent.trim()) continue;

    let rating = 5;
    if (ratingIdx !== -1 && row[ratingIdx]) {
      const parsedRating = parseInt(row[ratingIdx].trim(), 10);
      if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
        rating = parsedRating;
      }
    }

    const authorName = authorIdx !== -1 && row[authorIdx] ? sanitizeInput(row[authorIdx]) : "Anonymous";
    const source = sourceIdx !== -1 && row[sourceIdx] ? sanitizeInput(row[sourceIdx]) : "CSV Batch Upload";

    results.push({
      content: sanitizeInput(rawContent),
      rating,
      authorName,
      source,
    });
  }

  return results;
}

export function sanitizeInput(input: string): string {
  if (!input) return "";

  let cleaned = input.trim();

  // Strip formula injection characters at string start
  if (/^[=+\-@]/.test(cleaned)) {
    cleaned = "'" + cleaned;
  }

  // Strip HTML / script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  return cleaned.trim();
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ""));
  return result;
}
