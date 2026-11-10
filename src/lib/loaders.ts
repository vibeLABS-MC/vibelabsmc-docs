/** The shader loaders a page can apply to, in the order the docs name them. */
export const LOADERS = ["iris", "optifine"] as const;
export type Loader = (typeof LOADERS)[number];

const NAMES: Record<Loader, string> = { iris: "Iris", optifine: "OptiFine" };

/** "Iris and OptiFine", or "Iris only": the line under a page's title. */
export function loaderLabel(loaders: readonly Loader[]): string {
  const names = LOADERS.filter((l) => loaders.includes(l)).map((l) => NAMES[l]);
  return names.length === 1 ? `${names[0]} only` : names.join(" and ");
}
