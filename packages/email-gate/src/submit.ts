import type { Pool } from './db.js';
import { SubmitInputSchema, type SubmitInput, type SubmitResult } from './schema.js';

/**
 * Validates input and inserts (or idempotently updates) a subscriber row.
 *
 * Idempotency: ON DUPLICATE KEY UPDATE keeps the existing row unchanged but
 * returns the original insertId via LAST_INSERT_ID(id). Re-submitting the
 * same (siteId, email) pair is safe and returns the original row id.
 *
 * @param input  Raw (unvalidated) subscriber data.
 * @param pool   mysql2 connection pool — injected for testability.
 */
export async function submit(input: SubmitInput, pool: Pool): Promise<SubmitResult> {
  const parsed = SubmitInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map(i => i.message).join('; ') };
  }

  const { siteId, listSegment, email, source } = parsed.data;

  try {
    // execute() returns [ResultSetHeader, FieldPacket[]] for INSERT statements.
    // Our minimal Pool interface types the first element as `any` to avoid
    // mysql2's complex overload resolution across pnpm dependency paths.
    const [result] = await pool.execute(
      `INSERT INTO email_subscribers (site_id, list_segment, email, source)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [siteId, listSegment, email, source ?? null],
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertId = (result as any).insertId as number;
    return { ok: true, id: insertId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
