const DISMISS_PREFIX = 'email-gate:dismissed:';

/**
 * Returns true if the user has dismissed the gate for this toolSlug
 * during the current browser session.
 */
export function isGateDismissed(toolSlug: string): boolean {
  if (typeof window === 'undefined' || !window.sessionStorage) return false;
  try {
    return window.sessionStorage.getItem(DISMISS_PREFIX + toolSlug) === '1';
  } catch {
    return false;
  }
}

export function markGateDismissed(toolSlug: string): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    window.sessionStorage.setItem(DISMISS_PREFIX + toolSlug, '1');
  } catch {
    /* silent */
  }
}

export function clearGateDismissed(toolSlug: string): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    window.sessionStorage.removeItem(DISMISS_PREFIX + toolSlug);
  } catch {
    /* silent */
  }
}
