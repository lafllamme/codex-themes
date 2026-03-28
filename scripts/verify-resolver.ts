#!/usr/bin/env node
import assert from 'node:assert/strict'
import { log } from './logger.ts'
import { recommendCodeThemeIdFromPayload } from './resolve-code-theme-id.ts'

/**
 * Lightweight smoke test for resolver stability across dark/light payloads.
 */
const darkBluePayload = {
  codeThemeId: 'monokai',
  variant: 'dark',
  theme: {
    accent: '#5ea0ff',
    contrast: 60,
    fonts: { code: null, ui: null },
    ink: '#e8f1ff',
    opaqueWindows: false,
    semanticColors: { diffAdded: '#51db8a', diffRemoved: '#ff6b7a', skill: '#66aaff' },
    surface: '#0b1220',
  },
}

const lightPayload = {
  codeThemeId: 'monokai',
  variant: 'light',
  theme: {
    accent: '#2f66c2',
    contrast: 60,
    fonts: { code: null, ui: null },
    ink: '#2b3445',
    opaqueWindows: true,
    semanticColors: { diffAdded: '#2f8f4e', diffRemoved: '#c33f45', skill: '#775fd6' },
    surface: '#f5f7fb',
  },
}

const darkResult = recommendCodeThemeIdFromPayload(darkBluePayload)
const lightResult = recommendCodeThemeIdFromPayload(lightPayload)

assert.ok(typeof darkResult === 'string' && darkResult.length > 0)
assert.ok(typeof lightResult === 'string' && lightResult.length > 0)
assert.notEqual(darkResult, undefined)
assert.notEqual(lightResult, undefined)

log.success('resolve-code-theme-id smoke test passed')
log.info(`dark payload -> ${darkResult}`)
log.info(`light payload -> ${lightResult}`)
