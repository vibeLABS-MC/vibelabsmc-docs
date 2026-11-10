import { describe, expect, it } from "bun:test";
import { PASSES, resolvePasses } from "./pipeline";

describe("resolvePasses", () => {
  it("returns each named pass, in the order the page lists them", () => {
    const passes = resolvePasses(["shadow", "gbuffers-opaque", "final"]);

    expect(passes.map((p) => p.program)).toEqual(["shadow", "gbuffers", "final"]);
    expect(passes[0]).toEqual(PASSES.shadow);
  });

  it("names the bad pass and lists the good ones when a page misspells one", () => {
    expect(() => resolvePasses(["shadow", "gbufers"])).toThrow(
      'Unknown pipeline pass "gbufers". Use one of: shadow, shadowcomp, prepare, gbuffers-opaque, deferred, gbuffers-translucent, composite, final.',
    );
  });

  it("rejects an empty diagram", () => {
    expect(() => resolvePasses([])).toThrow("A pipeline needs at least one pass.");
  });

  it("does not accept inherited object keys as pass names", () => {
    expect(() => resolvePasses(["toString"])).toThrow('Unknown pipeline pass "toString"');
  });
});

describe("PASSES", () => {
  it("marks exactly the world-drawing passes as geometry", () => {
    const geometry = Object.entries(PASSES)
      .filter(([, pass]) => pass.kind === "geometry")
      .map(([id]) => id);

    expect(geometry).toEqual(["shadow", "gbuffers-opaque", "gbuffers-translucent"]);
  });
});
