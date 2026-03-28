#!/usr/bin/env node
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { log } from './logger.ts'
import { recommendCodeThemeIdFromPayload } from './resolve-code-theme-id.ts'

/**
 * Re-evaluates generated presets and normalizes `codeThemeId` values.
 */
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PRESETS_DIR = path.join(SCRIPT_DIR, '..', 'output', 'theme-presets')

if (!fs.existsSync(PRESETS_DIR)) {
  log.error(`Preset directory not found: ${PRESETS_DIR}`)
  process.exit(1)
}

const files = fs.readdirSync(PRESETS_DIR)
  .filter(file => file.endsWith('.json'))
  .sort((a, b) => a.localeCompare(b))

let changed = 0
let unchanged = 0
const byTargetTheme = new Map()

for (const file of files) {
  const filePath = path.join(PRESETS_DIR, file)
  const raw = fs.readFileSync(filePath, 'utf8')
  let payload

  try {
    payload = JSON.parse(raw)
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    log.error(`Invalid JSON in ${file}: ${message}`)
    process.exit(1)
  }

  const current = typeof payload.codeThemeId === 'string' ? payload.codeThemeId : ''
  const next = recommendCodeThemeIdFromPayload(payload)

  byTargetTheme.set(next, (byTargetTheme.get(next) ?? 0) + 1)

  if (current === next) {
    unchanged++
    continue
  }

  payload.codeThemeId = next
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`)
  changed++
}

log.info(`Processed ${files.length} presets`)
log.info(`Changed: ${changed}`)
log.info(`Unchanged: ${unchanged}`)
log.step('By target theme')
for (const [theme, count] of [...byTargetTheme.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  log.info(`${theme}: ${count}`)
}
