import { addDays, differenceInDays, startOfDay } from 'date-fns'
import type { ComputedCycle, CycleEvent, PatchCycle } from '@/types'

/**
 * Given the original start date of the FIRST cycle, find where
 * we are in the current 28-day cycle (handles multiple cycles automatically)
 */
export function getCurrentCycleStart(startDate: Date): Date {
  const now = startOfDay(new Date())
  const start = startOfDay(startDate)
  const totalDays = differenceInDays(now, start)
  if (totalDays < 0) return start
  const cyclesElapsed = Math.floor(totalDays / 28)
  return addDays(start, cyclesElapsed * 28)
}

/**
 * Get all key dates for a given cycle start date
 */
export function getCycleDates(cycleStart: Date) {
  const s = startOfDay(cycleStart)
  return {
    put:      s,
    change1:  addDays(s, 7),
    change2:  addDays(s, 14),
    remove:   addDays(s, 21),
    newCycle: addDays(s, 28),
  }
}

/**
 * Fully compute the current state of a patch cycle
 */
export function computeCycle(cycle: PatchCycle): ComputedCycle {
  const startDate = new Date(cycle.start_date)
  const cycleStart = getCurrentCycleStart(startDate)
  const dates = getCycleDates(cycleStart)
  const now = startOfDay(new Date())
  const dayInCycle = differenceInDays(now, cycleStart)

  let currentWeek: 1 | 2 | 3 | 4
  if (dayInCycle < 7) currentWeek = 1
  else if (dayInCycle < 14) currentWeek = 2
  else if (dayInCycle < 21) currentWeek = 3
  else currentWeek = 4

  const isRestWeek = currentWeek === 4

  const events: CycleEvent[] = [
    { label: 'Cambio de parche (Sem. 2)', date: dates.change1, type: 'change', week: 2 },
    { label: 'Cambio de parche (Sem. 3)', date: dates.change2, type: 'change', week: 3 },
    { label: 'Retirar parche',             date: dates.remove,   type: 'remove',    week: 4 },
    { label: 'Nuevo ciclo',                date: dates.newCycle, type: 'new_cycle', week: 1 },
  ]

  const nextEvent = events.find(e => differenceInDays(e.date, now) >= 0) ?? events[events.length - 1]
  const daysUntilNextEvent = differenceInDays(nextEvent.date, now)

  return {
    cycleStart,
    ...dates,
    currentWeek,
    dayInCycle,
    daysUntilNextEvent,
    nextEvent,
    isRestWeek,
  }
}

/**
 * Returns how many full cycles have been completed since start
 */
export function getCycleNumber(startDate: Date): number {
  const now = startOfDay(new Date())
  const start = startOfDay(startDate)
  const totalDays = differenceInDays(now, start)
  return Math.floor(totalDays / 28) + 1
}

/**
 * Format date to Argentine locale
 */
export function formatDateAR(date: Date): string {
  return date.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatDateFullAR(date: Date): string {
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
  })
}
