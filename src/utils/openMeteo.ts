import { fallbackUv, type UvTimeMode, type UvWeather } from './uvDose'

type OpenMeteoResponse = {
  hourly?: {
    time?: string[]
    uv_index?: number[]
    uv_index_clear_sky?: number[]
    cloud_cover?: number[]
  }
}

const demoHourCandidates = ['11:00', '12:00']

const bengaluruDateKeyFor = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value ?? '1970'
  const month = parts.find((part) => part.type === 'month')?.value ?? '01'
  const day = parts.find((part) => part.type === 'day')?.value ?? '01'
  return `${year}-${month}-${day}`
}

const nearestLiveHourIndex = (times: string[]) => {
  const currentHour = new Date()
  currentHour.setMinutes(0, 0, 0)

  let nearestIndex = 0
  let nearestDistance = Number.POSITIVE_INFINITY
  times.forEach((time, index) => {
    const distance = Math.abs(new Date(time).getTime() - currentHour.getTime())
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })

  return nearestIndex
}

const nearestDemoHourIndex = (times: string[]) => {
  const now = new Date()
  const today = bengaluruDateKeyFor(now)
  const tomorrow = bengaluruDateKeyFor(new Date(now.getTime() + 24 * 60 * 60 * 1000))

  for (const day of [today, tomorrow]) {
    const candidates = times
      .map((time, index) => ({ time, index }))
      .filter(({ time }) => demoHourCandidates.some((hour) => time === `${day}T${hour}`))

    if (candidates.length > 0) {
      return candidates.reduce((best, candidate) => {
        const bestDistance = Math.abs(Number(best.time.slice(11, 13)) * 60 - 11.5 * 60)
        const candidateDistance = Math.abs(Number(candidate.time.slice(11, 13)) * 60 - 11.5 * 60)
        return candidateDistance < bestDistance ? candidate : best
      }, candidates[0]).index
    }
  }

  return nearestLiveHourIndex(times)
}

export const fetchBengaluruUv = async (timeMode: UvTimeMode): Promise<UvWeather> => {
  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&hourly=uv_index,uv_index_clear_sky,cloud_cover&timezone=Asia%2FKolkata&forecast_days=2',
    )
    if (!response.ok) throw new Error('UV request failed')

    const data = (await response.json()) as OpenMeteoResponse
    const times = data.hourly?.time ?? []
    const nearestIndex = timeMode === 'demo' ? nearestDemoHourIndex(times) : nearestLiveHourIndex(times)

    const uvIndex = data.hourly?.uv_index?.[nearestIndex]
    const uvClearSky = data.hourly?.uv_index_clear_sky?.[nearestIndex]
    const cloudCover = data.hourly?.cloud_cover?.[nearestIndex]

    if (uvIndex === undefined || uvClearSky === undefined || cloudCover === undefined) throw new Error('UV payload incomplete')

    return { uvIndex, uvClearSky, cloudCover, source: 'Open-Meteo' }
  } catch {
    return fallbackUv
  }
}
