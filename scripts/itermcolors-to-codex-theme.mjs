#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const [, , inputPath, outputPath = 'codex-theme.json', themeName = 'iterm-derived'] = process.argv;

if (!inputPath) {
  console.error('Usage: node scripts/itermcolors-to-codex-theme.mjs <input.itermcolors> [output.json] [theme-name]');
  process.exit(1);
}

const jsonText = execFileSync('plutil', ['-convert', 'json', '-o', '-', inputPath], {
  encoding: 'utf8'
});
const data = JSON.parse(jsonText);

function hex(color) {
  const r = Math.round((color?.['Red Component'] ?? 0) * 255).toString(16).padStart(2, '0');
  const g = Math.round((color?.['Green Component'] ?? 0) * 255).toString(16).padStart(2, '0');
  const b = Math.round((color?.['Blue Component'] ?? 0) * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

const ansi = Array.from({ length: 16 }, (_, i) => hex(data[`Ansi ${i} Color`]));
const bg = hex(data['Background Color']);
const fg = hex(data['Foreground Color']);
const cursor = hex(data['Cursor Color']);

const theme = {
  $schema: 'vscode://schemas/color-theme',
  name: themeName,
  displayName: themeName,
  type: 'dark',
  colors: {
    'editor.background': bg,
    'editor.foreground': fg,
    'editorCursor.foreground': cursor,
    'terminal.ansiBlack': ansi[0],
    'terminal.ansiRed': ansi[1],
    'terminal.ansiGreen': ansi[2],
    'terminal.ansiYellow': ansi[3],
    'terminal.ansiBlue': ansi[4],
    'terminal.ansiMagenta': ansi[5],
    'terminal.ansiCyan': ansi[6],
    'terminal.ansiWhite': ansi[7],
    'terminal.ansiBrightBlack': ansi[8],
    'terminal.ansiBrightRed': ansi[9],
    'terminal.ansiBrightGreen': ansi[10],
    'terminal.ansiBrightYellow': ansi[11],
    'terminal.ansiBrightBlue': ansi[12],
    'terminal.ansiBrightMagenta': ansi[13],
    'terminal.ansiBrightCyan': ansi[14],
    'terminal.ansiBrightWhite': ansi[15]
  },
  tokenColors: [
    { name: 'Default', scope: ['source', 'text'], settings: { foreground: fg } },
    { name: 'Comments', scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: ansi[8], fontStyle: 'italic' } },
    { name: 'Strings', scope: ['string', 'string.quoted'], settings: { foreground: ansi[10] } },
    { name: 'Numbers', scope: ['constant.numeric', 'constant.language.boolean'], settings: { foreground: ansi[11] } },
    { name: 'Keywords', scope: ['keyword', 'storage', 'storage.type', 'keyword.operator'], settings: { foreground: ansi[12] } },
    { name: 'Functions', scope: ['entity.name.function', 'meta.function-call', 'support.function', 'variable.function'], settings: { foreground: ansi[9] } },
    { name: 'Types', scope: ['entity.name.type', 'support.type', 'support.class'], settings: { foreground: ansi[3] } },
    { name: 'Constants', scope: ['constant', 'constant.language', 'constant.other', 'support.constant'], settings: { foreground: ansi[1] } },
    { name: 'Variables', scope: ['variable', 'variable.parameter', 'variable.other.readwrite'], settings: { foreground: fg } },
    { name: 'Punctuation', scope: ['punctuation', 'punctuation.separator', 'punctuation.bracket'], settings: { foreground: ansi[6] } }
  ]
};

fs.writeFileSync(outputPath, `${JSON.stringify(theme, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outputPath}`);
