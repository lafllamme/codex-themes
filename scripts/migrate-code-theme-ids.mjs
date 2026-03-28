#!/usr/bin/env node
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { recommendCodeThemeIdFromPayload } from './code-theme-resolver.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PRESETS_DIR = path.join(SCRIPT_DIR, '..', 'output', 'theme-presets')

if (!fs.existsSync(PRESETS_DIR)) {
  throw new Error(`Preset directory not found: ${PRESETS_DIR}`)
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
    throw new Error(`Invalid JSON in ${file}: ${error.message}`)
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

console.log(`Processed ${files.length} presets`)
console.log(`Changed: ${changed}`)
console.log(`Unchanged: ${unchanged}`)
console.log('By target theme:')
for (const [theme, count] of [...byTargetTheme.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`  ${theme}: ${count}`)
}
