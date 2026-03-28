#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { log } from './logger.ts'

type GenerateTarget = 'all' | 'convert' | 'rescore' | 'test'

const args = process.argv.slice(2)
const target = (args[0] ?? 'all') as GenerateTarget

const scriptsDir = dirname(fileURLToPath(import.meta.url))

/**
 * Runs a child script with inherited stdio and exits on failure.
 */
function run(label: string, scriptFile: string, extraArgs: string[] = []): void {
  log.step(label)
  const scriptPath = join(scriptsDir, scriptFile)
  const result = spawnSync(process.execPath, [scriptPath, ...extraArgs], {
    stdio: 'inherit',
    shell: false,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (target === 'convert') {
  run('Convert iTerm2 themes', 'convert-iterm-themes.ts')
  process.exit(0)
}

if (target === 'rescore') {
  run('Re-score preset codeThemeIds', 'normalize-code-theme-ids.ts')
  process.exit(0)
}

if (target === 'test') {
  run('Run resolver smoke test', 'verify-resolver.ts')
  process.exit(0)
}

if (target === 'all') {
  run('Convert iTerm2 themes', 'convert-iterm-themes.ts')
  run('Re-score preset codeThemeIds', 'normalize-code-theme-ids.ts')
  run('Run resolver smoke test', 'verify-resolver.ts')
  log.success('Pipeline completed successfully.')
  process.exit(0)
}

log.error(`Unknown target: ${target}`)
log.info('Usage: pnpm generate [all|convert|rescore|test]')
process.exit(1)
