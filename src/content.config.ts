import { defineCollection } from "astro:content";
// `z` re-exported from `astro:content` is deprecated; import it from
// `astro/zod` (the pattern nimbus-docs' own schema helpers document).
import { z } from "astro/zod";
import { docsCollection } from "@cloudflare/nimbus-docs/content";
import { LOADERS } from "./lib/loaders";

export const collections = {
  docs: defineCollection(
    docsCollection({
      schemaFields: {
        // Nimbus docs are agent-friendly by default. Set `audience: human`
        // to flag a page that's written primarily for human readers.
        audience: z.literal("human").optional(),
        // Which shader loaders a page applies to; shown under the page title.
        loaders: z.array(z.enum(LOADERS)).min(1).default([...LOADERS]),
      },
    }),
  ),
};
