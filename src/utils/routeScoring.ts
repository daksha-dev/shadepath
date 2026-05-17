import { type Mode, type RouteOption, type Segment } from '../data/bangaloreRoutes'
import {
  bodyExposureFactor,
  cloudFactorFromCover,
  effectiveUv,
  fallbackUv,
  gradeForDose,
  riskForDosePerMinute,
  segmentDose,
  timeOfDayMultiplier,
  type UserProfile,
  type UvWeather,
} from './uvDose'

export type ScoredSegment = Segment & {
  minutes: number
  dose: number
  dosePerMinute: number
  risk: 'low' | 'medium' | 'high'
}

export type ScoredRoute = RouteOption & {
  distanceKm: number
  etaMinutes: number
  totalDose: number
  grade: string
  shadedPercent: number
  exposureSaved: number
  exposureSavedPercent: number
  peakEffectiveUv: number
  scoredSegments: ScoredSegment[]
}

export const identifyRouteBenchmarks = (routes: ScoredRoute[]) => {
  const fastestRoute = routes.reduce<ScoredRoute | undefined>(
    (fastest, route) => (!fastest || route.etaMinutes < fastest.etaMinutes ? route : fastest),
    undefined,
  )
  const lowestUvRoute = routes.reduce<ScoredRoute | undefined>(
    (lowest, route) => (!lowest || route.totalDose < lowest.totalDose ? route : lowest),
    undefined,
  )

  return { fastestRoute, lowestUvRoute }
}

export const scoreRoutes = (
  routes: RouteOption[],
  mode: Mode,
  profile: UserProfile,
  weather: UvWeather,
  departureOffsetMinutes: number,
  baseDepartureHour?: number,
): ScoredRoute[] => {
  const exposure = bodyExposureFactor(mode, profile)
  const cloudFactor = cloudFactorFromCover(weather.cloudCover)
  const uvNow = Math.max(weather.uvIndex, fallbackUv.uvIndex) * timeOfDayMultiplier(departureOffsetMinutes, baseDepartureHour)

  const scored = routes.map((route) => {
    const distanceKm = route.demoDistanceKm
    const etaMinutes = route.demoEtaMinutes
    const segmentDistanceKm = route.segments.reduce((sum, segment) => sum + segment.distanceKm, 0)

    const scoredSegments = route.segments.map((segment) => {
      const minutes = segmentDistanceKm ? (segment.distanceKm / segmentDistanceKm) * etaMinutes : etaMinutes / route.segments.length
      const dose = segmentDose(uvNow, cloudFactor, segment.shadeFraction, exposure, minutes) * route.uvDoseMultiplier
      const dosePerMinute = dose / minutes
      return {
        ...segment,
        minutes,
        dose,
        dosePerMinute,
        risk: riskForDosePerMinute(dosePerMinute),
      }
    })

    const totalDose = scoredSegments.reduce((sum, segment) => sum + segment.dose, 0)
    const peakEffectiveUv = Math.max(
      ...route.segments.map((segment) => effectiveUv(uvNow, cloudFactor, segment.shadeFraction, exposure) * route.uvDoseMultiplier),
    )

    return {
      ...route,
      distanceKm,
      etaMinutes,
      totalDose,
      grade: gradeForDose(totalDose),
      shadedPercent: route.demoShadeFraction * 100,
      exposureSaved: 0,
      exposureSavedPercent: 0,
      peakEffectiveUv,
      scoredSegments,
    }
  })

  const { fastestRoute, lowestUvRoute } = identifyRouteBenchmarks(scored)
  const fastestDose = fastestRoute?.totalDose ?? scored[0]?.totalDose ?? 0

  return scored
    .map((route) => ({
      ...route,
      exposureSaved: Math.max(0, fastestDose - route.totalDose),
      exposureSavedPercent: fastestDose ? Math.max(0, ((fastestDose - route.totalDose) / fastestDose) * 100) : 0,
    }))
    .sort((a, b) => a.totalDose - b.totalDose || (a.id === lowestUvRoute?.id ? -1 : b.id === lowestUvRoute?.id ? 1 : 0))
}

export const safestDepartureInsight = (
  routes: RouteOption[],
  mode: Mode,
  profile: UserProfile,
  weather: UvWeather,
  selectedRouteId: string,
  baseDepartureHour?: number,
) => {
  const offsets = [0, 30, 60, 90, 120]
  const values = offsets.map((offset) => {
    const route = scoreRoutes(routes, mode, profile, weather, offset, baseDepartureHour).find((item) => item.id === selectedRouteId)
    return { offset, dose: route?.totalDose ?? 0 }
  })
  return values.reduce((best, item) => (item.dose < best.dose ? item : best), values[0])
}
