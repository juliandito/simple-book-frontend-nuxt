/**
 * Format an ISO date string into a human-readable local date.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Truncate a string to a maximum length, appending an ellipsis if needed.
 */
export function truncate(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}…`
}

/**
 * Build a URL query string from an object, omitting undefined/null/empty values.
 */
export function buildQuery(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  )
  if (entries.length === 0) return ''
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
}

/**
 * Sleep for a given number of milliseconds (useful for debounce patterns).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
