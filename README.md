# vibeLABS docs

Free, community-written documentation for Minecraft shaders: install a shaderpack, fix what
breaks, or write your own for Iris and OptiFine. Live at
[docs.vibelabsmc.org](https://docs.vibelabsmc.org).

Built with [Nimbus](https://nimbus-docs.com) (Cloudflare's docs framework on Astro) and
[Bun](https://bun.sh). The landing site lives in
[vibelabsmc-website](https://github.com/vibeLABS-MC/vibelabsmc-website).

## Run it

You need [Bun](https://bun.sh) 1.4 or later and Node 22.12 or later (Astro runs on Node).

```sh
bun install
bun run dev          # http://localhost:4321
```

| Command               | What it does                                                         |
| --------------------- | -------------------------------------------------------------------- |
| `bun test`            | Unit tests for the logic in `src/lib/`                               |
| `bun run typecheck`   | `astro check`: types in every `.astro` and `.ts` file                |
| `bun run lint:docs`   | Nimbus authoring rules: frontmatter shape and internal links         |
| `bun run build`       | Static site in `dist/`, with the Pagefind search index               |
| `bun run check`       | Nimbus preflight; run it after a build so it can check links as well |
| `bun run preview`     | Serve `dist/` locally                                                |

CI runs all of these on every pull request, and deploys `main` to GitHub Pages.

## Write a page

Pages are MDX files in `src/content/docs/`. The folder is the sidebar group and the URL:
`src/content/docs/developing/shader-stages.mdx` is served at `/developing/shader-stages/`.

```mdx
---
title: Shader stages
description: One sentence that says what the reader will learn.
sidebar:
  order: 4
lastUpdated: 2026-11-08
loaders: [iris, optifine]
---

Write the page here. The title becomes the heading, so don't repeat it.

<Aside type="caution" title="Iris only">
Say which loader does what when they differ.
</Aside>

<Pipeline passes={["shadow", "gbuffers-opaque", "deferred", "composite", "final"]} />
```

- `loaders` says which shader loaders the page applies to. It shows under the title.
- `lastUpdated` is the date the facts were last checked. Without it, the last commit date is used.
- Components every page can use: `Aside`, `Card`, `CardGrid`, `Steps`/`Step`, `Tabs`/`TabItem`,
  `PackageManagers` and `Pipeline`. They are registered in `src/components.ts`.
- Code fences take a language, a `title="file.fsh"` and lines to highlight: ` ```glsl title="final.fsh" {3-5} `.

Read [AGENT.md](./AGENT.md) for the content rules, the project layout and how to upgrade Nimbus.

## Launch

The site is in preview: every page carries `noindex` and `robots.txt` disallows crawling, so
unreviewed pages stay out of search results. To launch, set `LAUNCHED = true` in
`src/lib/site.ts`.
