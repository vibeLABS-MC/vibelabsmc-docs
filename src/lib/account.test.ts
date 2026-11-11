import { describe, expect, it } from "bun:test";
import { initials, parseSession, signInUrl, signOutUrl } from "./account";

const ORIGIN = "https://develop.vibelabsmc.org";
const good = {
  signedIn: true,
  username: "steve",
  displayName: "Steve Miner",
  avatarUrl: `${ORIGIN}/media/${"a".repeat(64)}.webp`,
  profileUrl: `${ORIGIN}/user/steve`,
};

describe("parseSession", () => {
  it("reads a signed-in answer", () => {
    expect(parseSession(good, ORIGIN)).toEqual({ ...good, signedIn: true });
  });

  it("treats anything else as signed out", () => {
    for (const json of [null, "x", {}, { signedIn: false }, { signedIn: "true" }, { ...good, username: "" }, { ...good, username: 5 }])
      expect(parseSession(json, ORIGIN)).toEqual({ signedIn: false });
  });

  it("drops links and pictures that point anywhere but the account site", () => {
    expect(parseSession({ ...good, profileUrl: "javascript:alert(1)" }, ORIGIN)).toEqual({ signedIn: false });
    expect(parseSession({ ...good, profileUrl: "https://evil.example/user/steve" }, ORIGIN)).toEqual({ signedIn: false });
    expect(parseSession({ ...good, avatarUrl: "https://tracker.example/pixel.png" }, ORIGIN)).toMatchObject({ avatarUrl: null });
    expect(parseSession({ ...good, avatarUrl: null }, ORIGIN)).toMatchObject({ avatarUrl: null });
    expect(parseSession({ ...good, avatarUrl: "not a url" }, ORIGIN)).toMatchObject({ avatarUrl: null });
  });

  it("falls back to the username for a missing or overlong display name", () => {
    expect(parseSession({ ...good, displayName: "" }, ORIGIN)).toMatchObject({ displayName: "steve" });
    expect(parseSession({ ...good, displayName: "x".repeat(65) }, ORIGIN)).toMatchObject({ displayName: "steve" });
    expect(parseSession({ ...good, username: "x".repeat(25) }, ORIGIN)).toEqual({ signedIn: false });
  });
});

describe("links", () => {
  it("sends people to sign in or out and back to the page they were on", () => {
    const page = "https://docs.vibelabsmc.org/using/install-iris/#step-2";
    expect(signInUrl(ORIGIN, page)).toBe(`${ORIGIN}/login?next=https%3A%2F%2Fdocs.vibelabsmc.org%2Fusing%2Finstall-iris%2F%23step-2`);
    expect(signOutUrl(ORIGIN, page)).toBe(`${ORIGIN}/logout?next=https%3A%2F%2Fdocs.vibelabsmc.org%2Fusing%2Finstall-iris%2F%23step-2`);
  });
});

describe("initials", () => {
  it("takes the first and last word, or one letter", () => {
    expect(initials("Steve Miner")).toBe("SM");
    expect(initials("kit")).toBe("K");
    expect(initials("  ")).toBe("?");
  });
});
