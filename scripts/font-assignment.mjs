/**
 * Deterministic font assignment for generated (iTerm-converted) themes.
 * Scope: generator-side only, does not touch curated Codex presets.
 */

const SYSTEM_SANS_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
const SYSTEM_MONO_STACK = 'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
const CONSOLAS_STACK = 'Consolas, "Courier New", monospace'
const MENLO_STACK = 'Menlo, Monaco, "Courier New", monospace'
const COURIER_STACK = '"Courier New", Courier, monospace'
const LUCIDA_STACK = '"Lucida Console", Monaco, monospace'

const UI_POOL = [
  { value: null, weight: 44 },
  { value: SYSTEM_SANS_STACK, weight: 24 },
  { value: 'Inter', weight: 14 },
  { value: 'Satoshi', weight: 10 },
  { value: 'Arial, Helvetica, sans-serif', weight: 4 },
  { value: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', weight: 2 },
  { value: '"Trebuchet MS", Helvetica, sans-serif', weight: 1 },
  { value: SYSTEM_MONO_STACK, weight: 1 },
]

const CODE_POOL = [
  { value: null, weight: 52 },
  { value: SYSTEM_MONO_STACK, weight: 30 },
  { value: CONSOLAS_STACK, weight: 10 },
  { value: MENLO_STACK, weight: 4 },
  { value: COURIER_STACK, weight: 2 },
  { value: LUCIDA_STACK, weight: 2 },
]

const CODE_MONO_ONLY_POOL = [
  { value: SYSTEM_MONO_STACK, weight: 60 },
  { value: CONSOLAS_STACK, weight: 22 },
  { value: MENLO_STACK, weight: 10 },
  { value: COURIER_STACK, weight: 4 },
  { value: LUCIDA_STACK, weight: 4 },
]

function fnv1a32(input) {
  let hash = 0x811C9DC5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function makeRng(seed) {
  let state = seed >>> 0 || 0x9E3779B9
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 0x100000000
  }
}

function pickWeighted(pool, rng) {
  const total = pool.reduce((sum, item) => sum + item.weight, 0)
  let needle = rng() * total
  for (const item of pool) {
    needle -= item.weight
    if (needle <= 0)
      return item.value
  }
  return pool[pool.length - 1].value
}

function isMonoFont(value) {
  return typeof value === 'string' && /monospace|mono/i.test(value)
}

export function assignFontsForTheme(themeId, variant = 'dark') {
  const baseSeed = fnv1a32(`${themeId}:${variant}`)
  const uiRng = makeRng(baseSeed ^ 0xA1B2C3D4)
  const codeRng = makeRng(baseSeed ^ 0xC3D4E5F6)

  const ui = pickWeighted(UI_POOL, uiRng)
  const code = isMonoFont(ui)
    ? pickWeighted(CODE_MONO_ONLY_POOL, codeRng)
    : pickWeighted(CODE_POOL, codeRng)

  return { ui, code }
}

export const FONT_POOLS = {
  UI_POOL,
  CODE_POOL,
  CODE_MONO_ONLY_POOL,
}
