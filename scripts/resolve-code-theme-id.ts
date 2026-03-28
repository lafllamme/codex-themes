/**
 * Core theme resolver.
 *
 * Given a Codex payload, this module scores official code themes against
 * readability and semantic fit, then returns the best matching `codeThemeId`.
 */
import { BASE_TOKEN_SET, type TokenPreset } from './token-presets.ts'

export const OFFICIAL_CODE_THEME_IDS = [
  'absolutely',
  'ayu',
  'catppuccin',
  'codex',
  'dracula',
  'everforest',
  'github',
  'gruvbox',
  'linear',
  'lobster',
  'material',
  'matrix',
  'monokai',
  'night-owl',
  'nord',
  'notion',
  'one',
  'oscurange',
  'rose-pine',
  'sentry',
  'solarized',
  'temple',
  'tokyo-night',
  'vscode-plus',
]

export const DEFAULT_CODE_THEME_ID = 'monokai'

export interface ResolverPayload {
  theme?: {
    surface?: string
    ink?: string
    accent?: string
    semanticColors?: {
      diffAdded?: string
      diffRemoved?: string
      skill?: string
    }
  }
}

const HEX_RGB_RE = /^#?[\da-f]{6}$/i
const TOKEN_KEYS = ['default', 'keyword', 'string', 'comment', 'function', 'type', 'number', 'meta']
const TOKEN_MIN_RATIO = { default: 4.5, keyword: 3.0, string: 3.0, comment: 2.8, function: 3.0, type: 3.0, number: 3.0, meta: 2.5 }
const TOKEN_WEIGHT = { default: 2.2, keyword: 1.3, string: 1.2, comment: 0.8, function: 1.1, type: 1.0, number: 1.0, meta: 0.7 }

function parseHexRgb(color) {
  const normalized = String(color ?? '').trim()
  if (!HEX_RGB_RE.test(normalized))
    return null
  const hex = normalized.replace('#', '')
  const int = Number.parseInt(hex, 16)
  return [(int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF]
}

function toHex(rgb) {
  const [r, g, b] = rgb
  const to = value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

function mix(a, b, amount) {
  const t = Math.max(0, Math.min(1, amount))
  return [
    Math.round(a[0] * (1 - t) + b[0] * t),
    Math.round(a[1] * (1 - t) + b[1] * t),
    Math.round(a[2] * (1 - t) + b[2] * t),
  ]
}

function luminance(color) {
  const rgb = parseHexRgb(color)
  if (!rgb)
    return 0

  const channels = rgb.map((v) => {
    const srgb = v / 255
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(a, b) {
  const la = luminance(a)
  const lb = luminance(b)
  const light = Math.max(la, lb)
  const dark = Math.min(la, lb)
  return (light + 0.05) / (dark + 0.05)
}

function colorDistance(a, b) {
  const ar = parseHexRgb(a)
  const br = parseHexRgb(b)
  if (!ar || !br)
    return 0
  const dr = ar[0] - br[0]
  const dg = ar[1] - br[1]
  const db = ar[2] - br[2]
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

function ensureReadableToken(token, surface, ink, minRatio) {
  const tokenRgb = parseHexRgb(token)
  const surfaceRgb = parseHexRgb(surface)
  const inkRgb = parseHexRgb(ink)

  if (!tokenRgb || !surfaceRgb || !inkRgb)
    return token

  if (contrastRatio(token, surface) >= minRatio)
    return token

  let best = token
  let bestRatio = contrastRatio(token, surface)

  for (let i = 1; i <= 10; i++) {
    const towardInk = toHex(mix(tokenRgb, inkRgb, i / 10))
    const towardSurfaceInverse = toHex(mix(tokenRgb, surfaceRgb, i / 10))

    const inkRatio = contrastRatio(towardInk, surface)
    if (inkRatio > bestRatio) {
      best = towardInk
      bestRatio = inkRatio
    }

    const invRatio = contrastRatio(towardSurfaceInverse, surface)
    if (invRatio > bestRatio) {
      best = towardSurfaceInverse
      bestRatio = invRatio
    }

    if (bestRatio >= minRatio)
      break
  }

  return bestRatio >= minRatio ? best : ink
}

function normalizedTokens(payload, themeId) {
  const base: TokenPreset = BASE_TOKEN_SET[themeId] ?? BASE_TOKEN_SET[DEFAULT_CODE_THEME_ID]
  const surface = payload?.theme?.surface ?? '#111111'
  const ink = payload?.theme?.ink ?? '#ffffff'

  return {
    default: ensureReadableToken(base.default, surface, ink, TOKEN_MIN_RATIO.default),
    keyword: ensureReadableToken(base.keyword, surface, ink, TOKEN_MIN_RATIO.keyword),
    string: ensureReadableToken(base.string, surface, ink, TOKEN_MIN_RATIO.string),
    comment: ensureReadableToken(base.comment, surface, ink, TOKEN_MIN_RATIO.comment),
    function: ensureReadableToken(base.function, surface, ink, TOKEN_MIN_RATIO.function),
    type: ensureReadableToken(base.type, surface, ink, TOKEN_MIN_RATIO.type),
    number: ensureReadableToken(base.number, surface, ink, TOKEN_MIN_RATIO.number),
    meta: ensureReadableToken(base.meta, surface, ink, TOKEN_MIN_RATIO.meta),
  }
}

function scoreTokenSet(payload, tokens) {
  const surface = payload?.theme?.surface ?? '#111111'
  const accent = payload?.theme?.accent ?? '#4d78cc'
  const diffAdded = payload?.theme?.semanticColors?.diffAdded ?? '#63db96'
  const diffRemoved = payload?.theme?.semanticColors?.diffRemoved ?? '#ff6b7a'
  const skill = payload?.theme?.semanticColors?.skill ?? '#7cb7ff'
  const surfaceLum = luminance(surface)

  let score = 0

  for (const key of TOKEN_KEYS) {
    const ratio = contrastRatio(tokens[key], surface)
    const minRatio = TOKEN_MIN_RATIO[key]
    const weight = TOKEN_WEIGHT[key]

    score += Math.min(ratio, 8) * weight

    if (ratio < minRatio)
      score -= (minRatio - ratio) * 6 * weight
  }

  const semanticKeys = ['keyword', 'string', 'function', 'type', 'number']
  const avgTokenLum = semanticKeys
    .map(key => luminance(tokens[key]))
    .reduce((a, b) => a + b, 0) / semanticKeys.length

  if (surfaceLum < 0.45)
    score += avgTokenLum * 1.2
  else
    score += (1 - avgTokenLum) * 1.2

  const accentDistanceAvg = ['keyword', 'function', 'type']
    .map(key => colorDistance(accent, tokens[key]))
    .reduce((a, b) => a + b, 0) / 3

  if (colorDistance(accent, tokens.keyword) < 38)
    score -= 1.4

  const semanticDistanceAvg = [
    colorDistance(skill, tokens.function),
    colorDistance(diffAdded, tokens.string),
    colorDistance(diffRemoved, tokens.comment),
  ].reduce((a, b) => a + b, 0) / 3

  score += Math.max(0, 2.2 - (semanticDistanceAvg / 70))
  score += Math.min(accentDistanceAvg / 60, 1.2)

  return score
}

/**
 * Recommends the best matching official `codeThemeId` for a payload.
 */
export function recommendCodeThemeIdFromPayload(payload: ResolverPayload): string {
  let bestThemeId = DEFAULT_CODE_THEME_ID
  let bestScore = Number.NEGATIVE_INFINITY

  for (const themeId of OFFICIAL_CODE_THEME_IDS) {
    const tokens = normalizedTokens(payload, themeId)
    const score = scoreTokenSet(payload, tokens)

    if (score > bestScore) {
      bestScore = score
      bestThemeId = themeId
    }
  }

  return bestThemeId
}
