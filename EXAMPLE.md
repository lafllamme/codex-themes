# Example: Quick Pipeline Check

A sample source file is already included:

- `input/themes-raw/example-ayu.itermcolors`

## Run

From inside `codex-themes/`:

```bash
pnpm convert
```

## Expected Output

You should see conversion logs and generated files in:

- `output/theme-presets/` (for example: `ayu-iterm.json`)

## Full Validation

```bash
pnpm generate
```

This runs convert + rescore + smoke test.
