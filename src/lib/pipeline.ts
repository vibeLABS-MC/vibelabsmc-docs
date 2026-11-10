/**
 * The passes of one Iris/OptiFine frame, in the order they run. Pages draw a
 * diagram of some of them with <Pipeline passes={[...]} />, naming each by
 * its key here.
 */
export type PassKind = "geometry" | "fullscreen";

export interface Pass {
  /** The program family that runs in this pass, shown in code style. */
  program: string;
  kind: PassKind;
  title: string;
  caption: string;
}

export const PASSES = {
  shadow: { program: "shadow", kind: "geometry", title: "Shadow map", caption: "The world from the sun" },
  shadowcomp: { program: "shadowcomp", kind: "fullscreen", title: "Shadow post", caption: "Filters the shadow map" },
  prepare: { program: "prepare", kind: "fullscreen", title: "Prepare", caption: "Before the world draws" },
  "gbuffers-opaque": { program: "gbuffers", kind: "geometry", title: "Opaque geometry", caption: "Blocks, entities, sky" },
  deferred: { program: "deferred", kind: "fullscreen", title: "Lighting", caption: "Lights the opaque scene" },
  "gbuffers-translucent": { program: "gbuffers", kind: "geometry", title: "Translucent geometry", caption: "Water and glass" },
  composite: { program: "composite", kind: "fullscreen", title: "Post-processing", caption: "Fog, bloom, depth of field" },
  final: { program: "final", kind: "fullscreen", title: "To screen", caption: "Tone map and output" },
} as const satisfies Record<string, Pass>;

export type PassId = keyof typeof PASSES;

const isPassId = (name: string): name is PassId => Object.hasOwn(PASSES, name);

/** Looks up the passes a page names, failing the build on a typo. */
export function resolvePasses(names: readonly string[]): Pass[] {
  if (names.length === 0) throw new Error("A pipeline needs at least one pass.");
  return names.map((name) => {
    if (!isPassId(name)) {
      throw new Error(`Unknown pipeline pass "${name}". Use one of: ${Object.keys(PASSES).join(", ")}.`);
    }
    return PASSES[name];
  });
}
