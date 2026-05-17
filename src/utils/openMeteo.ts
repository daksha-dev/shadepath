import { fallbackUv, type UvWeather } from './uvDose'

type OpenMeteoResponse = {
  hourly?: {
    time?: string[]
    uv_index?: number[]
    uv_index_clear_sky?: number[]
    cloud_cover?: number[]
  }
}

export const fetchBengaluruUv = async (): Promise<UvWeather> => {
  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&hourly=uv_index,uv_index_clear_sky,cloud_cover&timezone=Asia%2FKolkata&forecast_days=2',
    )
    if (!response.ok) throw new Error('UV request failed')

    const data = (await response.json()) as OpenMeteoResponse
    const times = data.hourly?.time ?? []
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

    const uvIndex = data.hourly?.uv_index?.[nearestIndex]
    const uvClearSky = data.hourly?.uv_index_clear_sky?.[nearestIndex]
    const cloudCover = data.hourly?.cloud_cover?.[nearestIndex]

    if (uvIndex === undefined || uvClearSky === undefined || cloudCover === undefined) throw new Error('UV payload incomplete')

    return { uvIndex, uvClearSky, cloudCover, source: 'Open-Meteo' }
  } catch {
    return fallbackUv
  }
}
