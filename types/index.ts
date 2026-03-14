// ─── User ────────────────────────────────────────────────────────────────────
export type Theme = 'dark' | 'light'

export interface UserProfile {
  id: string
  auth0_id: string
  email: string
  name: string | null
  avatar_url: string | null
  notification_hour: number // 0-23, default 9
  timezone: string // e.g. "America/Argentina/Buenos_Aires"
  theme: Theme
  created_at: string
  updated_at: string
}

// ─── Patch Cycle ─────────────────────────────────────────────────────────────
export type PatchCycleStatus = 'active' | 'completed' | 'abandoned'

export interface PatchCycle {
  id: string
  user_id: string
  start_date: string // ISO date string
  patch_type: 'weekly'
  status: PatchCycleStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// ─── Computed Cycle ───────────────────────────────────────────────────────────
export type CycleEventType = 'put' | 'change' | 'remove' | 'new_cycle'

export interface CycleEvent {
  label: string
  date: Date
  type: CycleEventType
  week: number
}

export interface ComputedCycle {
  cycleStart: Date
  put: Date
  change1: Date
  change2: Date
  remove: Date
  newCycle: Date
  currentWeek: number    // 1–4
  dayInCycle: number     // 0–27
  daysUntilNextEvent: number
  nextEvent: CycleEvent
  isRestWeek: boolean
}
