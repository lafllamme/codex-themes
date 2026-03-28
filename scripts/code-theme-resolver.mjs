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

const BASE_TOKEN_SET = {
  'absolutely': { default: '#f9f9f7', keyword: '#cc7d5e', string: '#7fd962', comment: '#8f8f86', function: '#efb37a', type: '#cda1fa', number: '#f1ab77', meta: '#b5b4ad' },
  'ayu': { default: '#bfbdb6', keyword: '#ff8f40', string: '#b8cc52', comment: '#5c6773', function: '#ffb454', type: '#59c2ff', number: '#f29e74', meta: '#8a9199' },
  'catppuccin': { default: '#cdd6f4', keyword: '#cba6f7', string: '#a6e3a1', comment: '#6c7086', function: '#89b4fa', type: '#94e2d5', number: '#fab387', meta: '#a6adc8' },
  'codex': { default: '#fcfcfc', keyword: '#64b5ff', string: '#65d98f', comment: '#8b8f94', function: '#7cc4ff', type: '#b06dff', number: '#f7bc5e', meta: '#9aa0a7' },
  'dracula': { default: '#f8f8f2', keyword: '#ff79c6', string: '#50fa7b', comment: '#6272a4', function: '#8be9fd', type: '#bd93f9', number: '#ffb86c', meta: '#a3accf' },
  'everforest': { default: '#d3c6aa', keyword: '#e67e80', string: '#a7c080', comment: '#859289', function: '#7fbbb3', type: '#d699b6', number: '#dbbc7f', meta: '#9da9a0' },
  'github': { default: '#e6edf3', keyword: '#ff7b72', string: '#7ee787', comment: '#8b949e', function: '#79c0ff', type: '#d2a8ff', number: '#a5d6ff', meta: '#9da7b1' },
  'gruvbox': { default: '#ebdbb2', keyword: '#fb4934', string: '#b8bb26', comment: '#928374', function: '#83a598', type: '#d3869b', number: '#d79921', meta: '#a89984' },
  'linear': { default: '#e6e9ef', keyword: '#92a1ff', string: '#7ad9c0', comment: '#7f8ba1', function: '#82b1ff', type: '#c2a1ff', number: '#ffbe84', meta: '#99a3b7' },
  'lobster': { default: '#e4e4e7', keyword: '#ff7f7f', string: '#5be28a', comment: '#7f8796', function: '#66a6ff', type: '#8ca7ff', number: '#ffb266', meta: '#9da5b3' },
  'material': { default: '#eeffff', keyword: '#c792ea', string: '#c3e88d', comment: '#717cb4', function: '#82aaff', type: '#89ddff', number: '#f78c6c', meta: '#9ba7d0' },
  'matrix': { default: '#c7f9d8', keyword: '#1eff5a', string: '#7dffa8', comment: '#4b8c60', function: '#42ff84', type: '#a8ffcc', number: '#6dff9e', meta: '#6da785' },
  'monokai': { default: '#f8f8f2', keyword: '#f92672', string: '#a6e22e', comment: '#75715e', function: '#66d9ef', type: '#ae81ff', number: '#fd971f', meta: '#9f9a83' },
  'night-owl': { default: '#d6deeb', keyword: '#c792ea', string: '#addb67', comment: '#637777', function: '#82aaff', type: '#7fdbca', number: '#f78c6c', meta: '#7e98b3' },
  'nord': { default: '#d8dee9', keyword: '#81a1c1', string: '#a3be8c', comment: '#616e88', function: '#88c0d0', type: '#8fbcbb', number: '#b48ead', meta: '#7d8aa6' },
  'notion': { default: '#d9d9d8', keyword: '#6fa8ff', string: '#4ec9b0', comment: '#8b8b8a', function: '#5fa3ff', type: '#7cc4ff', number: '#f2bf79', meta: '#a1a1a0' },
  'one': { default: '#abb2bf', keyword: '#c678dd', string: '#98c379', comment: '#5c6370', function: '#61afef', type: '#56b6c2', number: '#d19a66', meta: '#7c8596' },
  'oscurange': { default: '#e6e6e6', keyword: '#f9b98c', string: '#63db96', comment: '#7a7a80', function: '#7cb7ff', type: '#479ffa', number: '#ffca7f', meta: '#9b9ba2' },
  'rose-pine': { default: '#e0def4', keyword: '#c4a7e7', string: '#9ccfd8', comment: '#6e6a86', function: '#9ccfd8', type: '#ebbcba', number: '#f6c177', meta: '#908caa' },
  'sentry': { default: '#e6dff9', keyword: '#8f7cff', string: '#8ee6d7', comment: '#7f769c', function: '#9cb7ff', type: '#7055f6', number: '#f0c176', meta: '#9f97ba' },
  'solarized': { default: '#839496', keyword: '#859900', string: '#2aa198', comment: '#586e75', function: '#268bd2', type: '#6c71c4', number: '#d33682', meta: '#657b83' },
  'temple': { default: '#c7e6da', keyword: '#e4f222', string: '#74ef8f', comment: '#5f7d74', function: '#7efab6', type: '#b5ff61', number: '#dbff5a', meta: '#7e9b91' },
  'tokyo-night': { default: '#a9b1d6', keyword: '#bb9af7', string: '#9ece6a', comment: '#565f89', function: '#7aa2f7', type: '#2ac3de', number: '#ff9e64', meta: '#7f89b0' },
  'vscode-plus': { default: '#d4d4d4', keyword: '#569cd6', string: '#ce9178', comment: '#6a9955', function: '#dcdcaa', type: '#4ec9b0', number: '#b5cea8', meta: '#9b9b9b' },
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
  const base = BASE_TOKEN_SET[themeId] ?? BASE_TOKEN_SET[DEFAULT_CODE_THEME_ID]
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

export function recommendCodeThemeIdFromPayload(payload) {
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
