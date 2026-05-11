import { readAlerts } from './alerts.js';
import { readDecisions } from './decisions.js';
import { readVoice } from './customer-voice.js';
import { readInbox } from './inbox.js';
import { readTimeLog } from './time-log.js';
import { readNewsletter } from './newsletter.js';
import { readTargets } from './targets.js';

export interface WeeklyReview {
  weekStart: Date;
  weekEnd: Date;
  weekLabel: string;
  alertsTotal: number;
  alertsByPriority: { P0: number; P1: number; P2: number };
  decisionsLogged: number;
  voiceCaptured: number;
  inboxCaptured: number;
  newsletterSends: number;
  timeMinutes: number;
  topTimeDomain: string | null;
  targetsAhead: number;
  targetsBehind: number;
  highlights: string[];      // auto-derived narrative bullets
  attention: string[];       // auto-derived "needs attention" bullets
}

export async function readWeeklyReview(weekOffset = 0): Promise<WeeklyReview> {
  const [alerts, decisions, voice, inbox, time, newsletter, targets] = await Promise.all([
    readAlerts(500),
    readDecisions(500),
    readVoice(500),
    readInbox(500),
    readTimeLog(),
    readNewsletter(),
    readTargets(),
  ]);

  // Compute Monday-of-week boundaries (offset weeks back if requested)
  const now = new Date();
  const dow = now.getDay();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - ((dow + 6) % 7) - (weekOffset * 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const weekStart = monday.getTime();
  const weekEnd = sunday.getTime();
  const inWeek = (ts: string) => {
    const t = new Date(ts).getTime();
    return t >= weekStart && t <= weekEnd;
  };

  const weeklyAlerts = alerts.filter((a) => inWeek(a.ts));
  const weeklyDecisions = decisions.filter((d) => inWeek(d.ts));
  const weeklyVoice = voice.filter((v) => inWeek(v.ts));
  const weeklyInbox = inbox.filter((i) => inWeek(i.ts));
  const weeklyNewsletter = newsletter.sent.filter((s) => inWeek(s.sent_at));

  const alertsByPriority = {
    P0: weeklyAlerts.filter((a) => a.priority === 'P0').length,
    P1: weeklyAlerts.filter((a) => a.priority === 'P1').length,
    P2: weeklyAlerts.filter((a) => a.priority === 'P2').length,
  };

  // Time: only this-week breakdown is in time-log report (assumes weekOffset = 0)
  const timeMinutes = weekOffset === 0 ? time.weekTotalMinutes : 0;
  const topTimeDomain = weekOffset === 0
    ? Object.entries(time.weekByDomain).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    : null;

  const allMonth = targets.month?.metrics ?? [];
  const allQ = targets.quarter?.metrics ?? [];
  const targetsAhead = [...allMonth, ...allQ].filter((m) => m.status === 'ahead' || m.status === 'on-pace').length;
  const targetsBehind = [...allMonth, ...allQ].filter((m) => m.status === 'behind' || m.status === 'critical').length;

  const highlights: string[] = [];
  const attention: string[] = [];

  if (weeklyDecisions.length > 0) highlights.push(`${weeklyDecisions.length} decision${weeklyDecisions.length > 1 ? 's' : ''} logged`);
  if (weeklyVoice.length > 0) highlights.push(`${weeklyVoice.length} customer quote${weeklyVoice.length > 1 ? 's' : ''} captured`);
  if (weeklyNewsletter.length > 0) highlights.push(`${weeklyNewsletter.length} newsletter send${weeklyNewsletter.length > 1 ? 's' : ''}`);
  if (timeMinutes > 0 && topTimeDomain) highlights.push(`${Math.floor(timeMinutes / 60)}h logged · top domain: ${topTimeDomain}`);
  if (alertsByPriority.P0 === 0 && weeklyAlerts.length > 0) highlights.push(`No P0 alerts this week`);
  if (targetsAhead > 0 && targetsBehind === 0) highlights.push(`All ${targetsAhead} targets on pace or ahead`);

  if (alertsByPriority.P0 > 0) attention.push(`${alertsByPriority.P0} P0 alert${alertsByPriority.P0 > 1 ? 's' : ''} fired this week`);
  if (targetsBehind > 0) attention.push(`${targetsBehind} target${targetsBehind > 1 ? 's' : ''} behind pace`);
  if (weeklyNewsletter.length === 0 && weekOffset === 0) attention.push(`No newsletter sent this week`);
  if (weeklyDecisions.length === 0) attention.push(`No decisions logged — shipping decisions tacit?`);
  if (weeklyVoice.length === 0) attention.push(`No customer quotes captured — listening tighter?`);

  return {
    weekStart: new Date(weekStart),
    weekEnd: new Date(weekEnd),
    weekLabel: weekOffset === 0 ? 'This week' : weekOffset === 1 ? 'Last week' : `${weekOffset} weeks ago`,
    alertsTotal: weeklyAlerts.length,
    alertsByPriority,
    decisionsLogged: weeklyDecisions.length,
    voiceCaptured: weeklyVoice.length,
    inboxCaptured: weeklyInbox.length,
    newsletterSends: weeklyNewsletter.length,
    timeMinutes,
    topTimeDomain,
    targetsAhead,
    targetsBehind,
    highlights,
    attention,
  };
}
