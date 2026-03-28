#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const target = args[0] ?? 'all'

const scriptsDir = dirname(fileURLToPath(import.meta.url))

function run(label, scriptFile, extraArgs = []) {
  console.log(`\n[codex-themes] ${label}`)
  const scriptPath = join(scriptsDir, scriptFile)
  const result = spawnSync(process.execPath, [scriptPath, ...extraArgs], {
    stdio: 'inherit',
    shell: false,
  })

  if (result.status !== 0)
    process.exit(result.status ?? 1)
}

if (target === 'convert') {
  run('Convert iTerm2 themes', 'convert-iterm2-themes.mjs')
  process.exit(0)
}

if (target === 'rescore') {
  run('Re-score preset codeThemeIds', 'migrate-code-theme-ids.mjs')
  process.exit(0)
}

if (target === 'test') {
  run('Run resolver smoke test', 'test-code-theme-resolver.mjs')
  process.exit(0)
}

if (target === 'all') {
  run('Convert iTerm2 themes', 'convert-iterm2-themes.mjs')
  run('Re-score preset codeThemeIds', 'migrate-code-theme-ids.mjs')
  run('Run resolver smoke test', 'test-code-theme-resolver.mjs')
  console.log('\n[codex-themes] Pipeline completed successfully.')
  process.exit(0)
}

console.error(`Unknown target: ${target}`)
console.error('Usage: node scripts/generate.mjs [all|convert|rescore|test]')
process.exit(1)
