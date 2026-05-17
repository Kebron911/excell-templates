import { PinInputSchema, type PinInput } from "../input.js";

export interface CsvParseError {
  line: number;
  message: string;
  raw: string;
}

export interface CsvParseResult {
  rows: PinInput[];
  errors: CsvParseError[];
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (inQuote) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQuote = false; }
      else { cur += c; }
    } else if (c === '"') {
      inQuote = true;
    } else if (c === ",") {
      out.push(cur); cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out.map(s => s.trim());
}

export function parsePinInputCsv(text: string): CsvParseResult {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return { rows: [], errors: [] };

  const headers = splitCsvLine(lines[0]!).map(h => h.trim());
  const rows: PinInput[] = [];
  const errors: CsvParseError[] = [];

  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i]!;
    const cells = splitCsvLine(raw);
    const obj: Record<string, string | undefined> = {};
    for (let j = 0; j < headers.length; j++) {
      const v = cells[j];
      if (v !== undefined && v.length > 0) obj[headers[j]!] = v;
    }
    const parsed = PinInputSchema.safeParse(obj);
    if (parsed.success) {
      rows.push(parsed.data);
    } else {
      errors.push({
        line: i + 1,
        message: parsed.error.issues.map(iss => `${iss.path.join(".")}: ${iss.message}`).join("; "),
        raw
      });
    }
  }
  return { rows, errors };
}
