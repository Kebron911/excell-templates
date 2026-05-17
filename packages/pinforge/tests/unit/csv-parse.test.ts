import { describe, expect, it } from "vitest";
import { parsePinInputCsv } from "../../src/csv/parse.js";

const CSV = `brandId,topic,primaryKeyword,destinationUrl,templateId,backgroundType,boardHint
strguests,7 house rules,airbnb house rules,https://strguests.tools/x,big-hook,image,STR Tips
strguests,Welcome book,vacation welcome book,https://strguests.tools/y,listicle,gradient,
`;

describe("parsePinInputCsv", () => {
  it("parses valid CSV into PinInput rows", () => {
    const result = parsePinInputCsv(CSV);
    expect(result.rows).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
    expect(result.rows[0]!.brandId).toBe("strguests");
    expect(result.rows[0]!.backgroundType).toBe("image");
    expect(result.rows[1]!.boardHint).toBeUndefined();
  });

  it("reports row-level errors without aborting", () => {
    const bad = `brandId,topic,primaryKeyword,destinationUrl\nstrguests,topic-a,kw-a,not-a-url\nstrguests,topic-b,kw-b,https://strguests.tools/ok`;
    const result = parsePinInputCsv(bad);
    expect(result.rows).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]!.line).toBe(2);
  });

  it("ignores extra columns", () => {
    const csv = `brandId,topic,primaryKeyword,destinationUrl,extra1,extra2\nstrguests,topic-a,kw,https://strguests.tools/x,ignored,also-ignored`;
    const result = parsePinInputCsv(csv);
    expect(result.rows).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it("handles quoted commas in fields", () => {
    const csv = `brandId,topic,primaryKeyword,destinationUrl\nstrguests,"hello, world","k1, k2",https://strguests.tools/x`;
    const result = parsePinInputCsv(csv);
    expect(result.rows[0]!.topic).toBe("hello, world");
  });
});
