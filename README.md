# Codex Themes Toolkit

Standalone Node.js toolkit to convert external theme sources (for example `.itermcolors`) into Codex-compatible JSON theme payloads.

## Folder Structure

- `input/themes-raw/`: drop your source `.itermcolors` files here
- `output/theme-presets/`: generated Codex JSON presets are written here
- `scripts/`: conversion, scoring, and test scripts

## Requirements

- Node.js 18+
- macOS `plutil` (used to parse `.itermcolors` plist files)

## Quick Start

1. Copy your `.itermcolors` files into `input/themes-raw/`.
2. Run the full pipeline:

```bash
node scripts/generate.mjs all
```

3. Find generated payloads in `output/theme-presets/`.

## Commands

```bash
# Convert source themes to Codex payload JSON
node scripts/generate.mjs convert

# Re-score and normalize codeThemeId across generated presets
node scripts/generate.mjs rescore

# Run resolver smoke test
node scripts/generate.mjs test

# Run convert + rescore + test
node scripts/generate.mjs all
```

## Script Notes

- `scripts/convert-iterm2-themes.mjs`
  - Reads from `input/themes-raw/`
  - Maps palette fields into `theme.surface`, `theme.ink`, `theme.accent`, and `theme.semanticColors`
  - Assigns fonts deterministically
  - Resolves a recommended `codeThemeId` via token readability scoring

- `scripts/migrate-code-theme-ids.mjs`
  - Re-evaluates generated presets and rewrites `codeThemeId` when a better match is found

- `scripts/code-theme-resolver.mjs`
  - Core scoring algorithm used by conversion/migration scripts


See also: ./EXAMPLE.md for a one-file smoke test.
