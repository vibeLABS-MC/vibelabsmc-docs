import { describe, expect, it } from "bun:test";
import { loaderLabel } from "./loaders";

describe("loaderLabel", () => {
  it("names one loader with its proper capitalisation", () => {
    expect(loaderLabel(["optifine"])).toBe("OptiFine only");
    expect(loaderLabel(["iris"])).toBe("Iris only");
  });

  it("names both loaders in a fixed order, whatever order the page lists them", () => {
    expect(loaderLabel(["optifine", "iris"])).toBe("Iris and OptiFine");
  });
});
