#!/usr/bin/env node
/**
 * Converts iTerm2 color schemes (`.itermcolors`) to Codex theme payloads (`.json`).
 *
 * Input directory:
 *   codex-themes/input/themes-raw/
 * Output directory:
 *   codex-themes/output/theme-presets/
 *
 * Usage:
 *   pnpm convert
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { assignFontsForTheme } from './assign-fonts.ts'
import { log } from './logger.ts'
import { recommendCodeThemeIdFromPayload } from './resolve-code-theme-id.ts'

type Variant = 'dark' | 'light'

interface ItermRgb {
  'Red Component'?: number
  'Green Component'?: number
  'Blue Component'?: number
}

interface ItermTheme {
  'Background Color'?: ItermRgb
  'Foreground Color'?: ItermRgb
  'Ansi 1 Color'?: ItermRgb
  'Ansi 2 Color'?: ItermRgb
  'Ansi 4 Color'?: ItermRgb
  'Ansi 5 Color'?: ItermRgb
}

interface CodexPayload {
  codeThemeId: string
  variant: Variant
  theme: {
    accent: string
    contrast: number
    fonts: { ui: string | null, code: string | null }
    ink: string
    opaqueWindows: boolean
    semanticColors: {
      diffAdded: string
      diffRemoved: string
      skill: string
    }
    surface: string
  }
}

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const TOOLKIT_ROOT = path.join(SCRIPT_DIR, '..')
const ITERM_SCHEMES_DIR = path.join(TOOLKIT_ROOT, 'input', 'themes-raw')
const OUTPUT_DIR = path.join(TOOLKIT_ROOT, 'output', 'theme-presets')

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

/**
 * Converts iTerm RGB components (0..1) into a normalized hex color.
 */
function rgbToHex(color?: ItermRgb): string {
  if (!color)
    return '#000000'

  const r = Math.round((color['Red Component'] ?? 0) * 255)
  const g = Math.round((color['Green Component'] ?? 0) * 255)
  const b = Math.round((color['Blue Component'] ?? 0) * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Computes relative luminance (0..1) for a hex color.
 */
function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const srgb = [r, g, b].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  )

  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

/**
 * Converts file names into stable output preset IDs.
 */
function toKebabCase(name: string): string {
  return name
    .replace(/\.itermcolors$/, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

/**
 * Converts one `.itermcolors` file into a Codex payload JSON object.
 */
function convertItermToCodex(itermPath: string): { id: string, payload: CodexPayload } {
  const jsonText = execFileSync('plutil', ['-convert', 'json', '-o', '-', itermPath], {
    encoding: 'utf8',
  })
  const data = JSON.parse(jsonText) as ItermTheme

  const surface = rgbToHex(data['Background Color'])
  const ink = rgbToHex(data['Foreground Color'])
  const accent = rgbToHex(data['Ansi 4 Color'])
  const diffAdded = rgbToHex(data['Ansi 2 Color'])
  const diffRemoved = rgbToHex(data['Ansi 1 Color'])
  const skill = rgbToHex(data['Ansi 5 Color'])

  const variant: Variant = getLuminance(surface) < 0.5 ? 'dark' : 'light'

  const filename = path.basename(itermPath)
  const id = toKebabCase(filename)
  const fonts = assignFontsForTheme(id, variant)

  const payload: CodexPayload = {
    codeThemeId: 'monokai',
    variant,
    theme: {
      accent,
      contrast: 60,
      fonts,
      ink,
      opaqueWindows: true,
      semanticColors: {
        diffAdded,
        diffRemoved,
        skill,
      },
      surface,
    },
  }

  payload.codeThemeId = recommendCodeThemeIdFromPayload(payload)

  return { id, payload }
}

if (!fs.existsSync(ITERM_SCHEMES_DIR)) {
  log.error(`Input directory not found: ${ITERM_SCHEMES_DIR}`)
  log.info('Create it and place .itermcolors files inside.')
  process.exit(1)
}

const itermFiles = fs.readdirSync(ITERM_SCHEMES_DIR)
  .filter(file => file.endsWith('.itermcolors'))

log.info(`Found ${itermFiles.length} iTerm2 color schemes to convert`)

let converted = 0
let updated = 0
let errors = 0

for (const file of itermFiles) {
  try {
    const itermPath = path.join(ITERM_SCHEMES_DIR, file)
    const { id, payload } = convertItermToCodex(itermPath)

    const outputPath = path.join(OUTPUT_DIR, `${id}.json`)
    const isUpdate = fs.existsSync(outputPath)

    fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`)

    if (isUpdate)
      updated++
    else
      converted++
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    log.error(`Error converting ${file}: ${message}`)
    errors++
  }
}

log.success('Done.')
log.info(`New themes: ${converted}`)
log.info(`Updated: ${updated}`)
if (errors > 0)
  log.warn(`Errors: ${errors}`)
else
  log.success('Errors: 0')
log.info(`Output: ${OUTPUT_DIR}`)
