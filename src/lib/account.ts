/**
 * The vibeLABS account shown in the docs header. The answer from the account site's
 * `/api/session` is checked field by field, so nothing unexpected (another origin's image, a
 * javascript: link) ever reaches the page.
 */

export type SessionView =
  | { signedIn: false }
  | { signedIn: true; username: string; displayName: string; avatarUrl: string | null; profileUrl: string };

const SIGNED_OUT: SessionView = { signedIn: false };

const text = (value: unknown, max = 64): string | null =>
  typeof value === "string" && value.length > 0 && value.length <= max ? value : null;

/** A link is kept only if it points at the account origin itself. */
function sameOrigin(value: unknown, origin: string): string | null {
  if (typeof value !== "string") return null;
  try {
    return new URL(value).origin === origin ? value : null;
  } catch {
    return null;
  }
}

export function parseSession(json: unknown, origin: string): SessionView {
  if (!json || typeof json !== "object" || (json as { signedIn?: unknown }).signedIn !== true) return SIGNED_OUT;
  const data = json as Record<string, unknown>;
  const username = text(data.username, 24);
  const profileUrl = sameOrigin(data.profileUrl, origin);
  if (!username || !profileUrl) return SIGNED_OUT;
  return {
    signedIn: true,
    username,
    displayName: text(data.displayName) ?? username,
    avatarUrl: sameOrigin(data.avatarUrl, origin),
    profileUrl,
  };
}

/** Sign in on the account site, then come back to this page. */
export const signInUrl = (origin: string, page: string): string => `${origin}/login?next=${encodeURIComponent(page)}`;

/** Sign out on the account site (it asks first), then come back to this page. */
export const signOutUrl = (origin: string, page: string): string => `${origin}/logout?next=${encodeURIComponent(page)}`;

/** "Steve Miner" -> "SM", for when there is no picture. */
export function initials(name: string): string {
  const words = name.trim().split(/[\s_-]+/).filter(Boolean);
  const letters = words.length > 1 ? [words[0]![0], words[words.length - 1]![0]] : [words[0]?.[0]];
  return letters.join("").toUpperCase() || "?";
}
