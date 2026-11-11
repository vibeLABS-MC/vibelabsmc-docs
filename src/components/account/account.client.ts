/**
 * account.client.ts: asks the account site who is signed in and fills in the header. Only
 * `textContent`, `src` and `href` are set, from values `parseSession` has already checked,
 * so nothing from the network is ever parsed as HTML.
 */
import { mount } from "@cloudflare/nimbus-docs/client";
import { initials, parseSession, signInUrl, signOutUrl } from "@/lib/account";

async function initAccount(root: HTMLElement): Promise<void> {
  const origin = root.dataset.origin ?? "";
  const here = location.href;
  const pick = <T extends Element>(selector: string) => root.querySelector<T>(selector);
  pick<HTMLAnchorElement>("[data-account-signin]")!.href = signInUrl(origin, here);

  let json: unknown = null;
  try {
    const response = await fetch(`${origin}/api/session`, { credentials: "include", cache: "no-store" });
    json = response.ok ? await response.json() : null;
  } catch {
    return; // offline or blocked: keep showing "Sign in"
  }
  const session = parseSession(json, origin);
  if (!session.signedIn) return;

  pick("[data-account-signin]")!.setAttribute("hidden", "");
  pick("[data-account-button]")!.removeAttribute("hidden");
  pick("[data-account-name]")!.textContent = session.displayName;
  pick("[data-account-handle]")!.textContent = `@${session.username}`;
  pick<HTMLAnchorElement>('[data-account-link="profile"]')!.href = session.profileUrl;
  pick<HTMLAnchorElement>("[data-account-signout]")!.href = signOutUrl(origin, here);
  const avatar = pick<HTMLImageElement>("[data-account-avatar]")!;
  if (session.avatarUrl) {
    avatar.src = session.avatarUrl;
    avatar.removeAttribute("hidden");
  } else {
    pick("[data-account-initials]")!.textContent = initials(session.displayName);
  }
}

mount("[data-nb-account]", (root) => {
  void initAccount(root);
  return () => {};
});
