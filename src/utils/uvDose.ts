import { modeBaseExposure, type Mode } from '../data/bangaloreRoutes'

export type Sleeves = 'none' | 'short' | 'long'

export type UserProfile = {
  skinType: number
  sleeves: Sleeves
  helmet: boolean
  sunscreenSpf: 0 | 15 | 30 | 50
}

export type UvWeather = {
  uvIndex: number
  uvClearSky: number
  cloudCover: number
  source: 'Open-Meteo' | 'Demo'
}

export type UvTimeMode = 'live' | 'demo'

export const fallbackUv: UvWeather = {
  uvIndex: 9.1,
  uvClearSky: 10.2,
  cloudCover: 20,
  source: 'Demo',
}

export const cloudFactorFromCover = (cloudCover: number) => Math.max(0.62, 1 - cloudCover / 220)

export const demoDepartureHour = 11.5

export const timeOfDayMultiplier = (departureOffsetMinutes: number, baseHour = demoDepartureHour) => {
  const hour = baseHour + departureOffsetMinutes / 60
  if (hour < 8) return 0.42
  if (hour < 10) return 0.68
  if (hour < 12) return 0.9
  if (hour < 15) return 1.08
  if (hour < 17) return 0.74
  return 0.38
}

export const bodyExposureFactor = (mode: Mode, profile: UserProfile) => {
  let factor = modeBaseExposure[mode]
  if (profile.sleeves === 'short') factor *= 0.9
  if (profile.sleeves === 'long') factor *= 0.68
  if (profile.helmet) factor *= mode === 'two-wheeler' ? 0.86 : 0.94

  const sunscreenProtection: Record<UserProfile['sunscreenSpf'], number> = {
    0: 1,
    15: 0.72,
    30: 0.58,
    50: 0.47,
  }

  factor *= sunscreenProtection[profile.sunscreenSpf]
  factor *= 1 + (6 - profile.skinType) * 0.035

  return Number(factor.toFixed(3))
}

export const segmentDose = (
  uvIndex: number,
  cloudFactor: number,
  shadeFraction: number,
  exposureFactor: number,
  segmentMinutes: number,
) => uvIndex * cloudFactor * (1 - shadeFraction) * exposureFactor * segmentMinutes

export const gradeForDose = (dose: number) => {
  if (dose < 80) return 'A'
  if (dose < 160) return 'B'
  if (dose < 240) return 'C'
  if (dose < 320) return 'D'
  return 'F'
}

export const riskForDosePerMinute = (dosePerMinute: number): 'low' | 'medium' | 'high' => {
  if (dosePerMinute < 2.4) return 'low'
  if (dosePerMinute < 4.5) return 'medium'
  return 'high'
}

export const effectiveUv = (uvIndex: number, cloudFactor: number, shadeFraction: number, exposureFactor: number) =>
  uvIndex * cloudFactor * (1 - shadeFraction) * exposureFactor
