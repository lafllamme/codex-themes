# Example: Quick Script Check

This toolkit already includes one sample source file:

- `input/themes-raw/example-ayu.itermcolors`

## Run

From inside `codex-themes/`:

```bash
node scripts/generate.mjs convert
```

## Expected Result

You should see output logs like:

- `Found ... iTerm2 color schemes to convert`
- `Done!`

And generated/updated JSON files in:

- `output/theme-presets/`

A concrete file to check after the run:

- `output/theme-presets/example-ayu.json`

## Optional Full Validation

```bash
node scripts/generate.mjs all
```

This runs convert + re-score + smoke test.
