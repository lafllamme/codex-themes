const RESET = '\x1b[0m'
const DIM = '\x1b[2m'
const CYAN = '\x1b[36m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const MAGENTA = '\x1b[35m'

const stampFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

function stamp(): string {
  return stampFormatter.format(new Date())
}

function line(level: string, color: string, message: string): string {
  return `${DIM}${stamp()}${RESET} ${color}${level}${RESET} ${message}`
}

export const log = {
  step(message: string): void {
    console.log(`\n${line('▶ STEP', MAGENTA, message)}`)
  },
  info(message: string): void {
    console.log(line('ℹ INFO', CYAN, message))
  },
  success(message: string): void {
    console.log(line('✔ OK', GREEN, message))
  },
  warn(message: string): void {
    console.warn(line('⚠ WARN', YELLOW, message))
  },
  error(message: string): void {
    console.error(line('✖ ERR', RED, message))
  },
}
