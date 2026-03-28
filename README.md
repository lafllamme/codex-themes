# Codex Themes Toolkit

A standalone TypeScript toolkit that turns raw theme palettes (for example `.itermcolors`) into Codex-compatible JSON presets.

## Why This Exists

This toolkit gives you a clean local pipeline for three things:

- convert raw theme files into Codex payloads
- normalize `codeThemeId` selection via a scoring resolver
- validate the resolver with a reproducible smoke test

## Project Layout

- `input/themes-raw/`: source `.itermcolors` files
- `output/theme-presets/`: generated Codex JSON presets
- `scripts/`: TypeScript pipeline scripts

## Requirements

- Node.js 18+
- macOS `plutil` (required to parse `.itermcolors` plist files)

## Commands

```bash
# install dependencies
pnpm install

# convert only
pnpm convert

# normalize codeThemeId values
pnpm rescore

# run resolver smoke test
pnpm test

# run full pipeline (convert + rescore + test)
pnpm generate
```

## Scripts

- `scripts/run-pipeline.ts`
  - pipeline entrypoint (`all | convert | rescore | test`)
- `scripts/convert-iterm-themes.ts`
  - reads `input/themes-raw/`, maps palette fields into Codex payloads, writes `output/theme-presets/`
- `scripts/normalize-code-theme-ids.ts`
  - re-scores generated payloads and updates `codeThemeId` when needed
- `scripts/resolve-code-theme-id.ts`
  - core scoring/resolver logic (readability + semantic fit)
- `scripts/assign-fonts.ts`
  - deterministic font assignment for generated themes
- `scripts/verify-resolver.ts`
  - smoke test for resolver stability

See also [EXAMPLE.md](./EXAMPLE.md) for a one-file quick check.
