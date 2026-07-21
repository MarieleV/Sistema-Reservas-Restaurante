export function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

export function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function monthLabel(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })
}

// Exportamos a constante de fonte também, pois vários lugares a utilizam
export const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const