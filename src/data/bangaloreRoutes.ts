export type Mode = 'two-wheeler' | 'cycle' | 'walk' | 'jog'

export type JourneyId = 'koramangala-mg-road' | 'indiranagar-cubbon' | 'jayanagar-city'

export type RouteKind = 'fastest' | 'balanced' | 'lowestUv'

export type LatLng = [number, number]

export type Segment = {
  id: string
  name: string
  coords: LatLng[]
  distanceKm: number
  shadeFraction: number
}

export type RouteOption = {
  id: RouteKind
  label: string
  subtitle: string
  color: string
  demoDistanceKm: number
  demoEtaMinutes: number
  demoShadeFraction: number
  uvDoseMultiplier: number
  segments: Segment[]
}

export type Journey = {
  id: JourneyId
  origin: string
  destination: string
  center: LatLng
  zoom: number
  routes: RouteOption[]
}

export const modeLabels: Record<Mode, string> = {
  'two-wheeler': 'Two-Wheeler',
  cycle: 'Cycle',
  walk: 'Walk',
  jog: 'Jog',
}

export const modeSpeedsKmh: Record<Mode, number> = {
  'two-wheeler': 32,
  cycle: 16,
  walk: 5,
  jog: 9,
}

export const modeBaseExposure: Record<Mode, number> = {
  'two-wheeler': 0.65,
  cycle: 0.75,
  walk: 0.6,
  jog: 0.9,
}

export const journeys: Journey[] = [
  {
    id: 'koramangala-mg-road',
    origin: 'Koramangala',
    destination: 'MG Road',
    center: [12.9586, 77.6207],
    zoom: 13,
    routes: [
      {
        id: 'fastest',
        label: 'Fastest Route',
        subtitle: 'Hosur Road flyover corridor',
        color: '#ef4444',
        demoDistanceKm: 14.1,
        demoEtaMinutes: 22,
        demoShadeFraction: 0.2,
        uvDoseMultiplier: 1.15,
        segments: [
          { id: 'f1', name: 'Koramangala 5th Block', coords: [[12.9352, 77.6245], [12.9386, 77.6237], [12.9437, 77.6252]], distanceKm: 1.25, shadeFraction: 0.22 },
          { id: 'f2', name: 'Adugodi exposed stretch', coords: [[12.9437, 77.6252], [12.9497, 77.6268], [12.9554, 77.6284]], distanceKm: 1.7, shadeFraction: 0.12 },
          { id: 'f3', name: 'Richmond Road', coords: [[12.9554, 77.6284], [12.9618, 77.6212], [12.9684, 77.6131]], distanceKm: 2.15, shadeFraction: 0.26 },
          { id: 'f4', name: 'MG Road approach', coords: [[12.9684, 77.6131], [12.9731, 77.6088], [12.9759, 77.6065]], distanceKm: 1.15, shadeFraction: 0.18 },
        ],
      },
      {
        id: 'balanced',
        label: 'Balanced Route',
        subtitle: 'Residency Road mixed shade',
        color: '#f59e0b',
        demoDistanceKm: 13.5,
        demoEtaMinutes: 25,
        demoShadeFraction: 0.38,
        uvDoseMultiplier: 0.97,
        segments: [
          { id: 'b1', name: 'Koramangala inner road', coords: [[12.9352, 77.6245], [12.9391, 77.6176], [12.9443, 77.6127]], distanceKm: 1.55, shadeFraction: 0.45 },
          { id: 'b2', name: 'Lalbagh connector', coords: [[12.9443, 77.6127], [12.9517, 77.6086], [12.9588, 77.6048]], distanceKm: 2.0, shadeFraction: 0.38 },
          { id: 'b3', name: 'Residency Road', coords: [[12.9588, 77.6048], [12.9669, 77.6064], [12.9759, 77.6065]], distanceKm: 2.45, shadeFraction: 0.34 },
        ],
      },
      {
        id: 'lowestUv',
        label: 'Lowest UV Route',
        subtitle: 'Tree-lined Richmond detour',
        color: '#16a34a',
        demoDistanceKm: 16,
        demoEtaMinutes: 30,
        demoShadeFraction: 0.58,
        uvDoseMultiplier: 0.91,
        segments: [
          { id: 'u1', name: 'Koramangala residential shade', coords: [[12.9352, 77.6245], [12.9345, 77.6178], [12.9398, 77.6115]], distanceKm: 1.8, shadeFraction: 0.58 },
          { id: 'u2', name: 'Lalbagh north edge', coords: [[12.9398, 77.6115], [12.9479, 77.6042], [12.9569, 77.5995]], distanceKm: 2.6, shadeFraction: 0.64 },
          { id: 'u3', name: 'Cubbon side streets', coords: [[12.9569, 77.5995], [12.9663, 77.5987], [12.9759, 77.6065]], distanceKm: 2.7, shadeFraction: 0.52 },
        ],
      },
    ],
  },
  {
    id: 'indiranagar-cubbon',
    origin: 'Indiranagar',
    destination: 'Cubbon Park',
    center: [12.9762, 77.6274],
    zoom: 13,
    routes: [
      {
        id: 'fastest',
        label: 'Fastest Route',
        subtitle: 'Old Madras Road direct',
        color: '#ef4444',
        demoDistanceKm: 14.1,
        demoEtaMinutes: 22,
        demoShadeFraction: 0.2,
        uvDoseMultiplier: 1.15,
        segments: [
          { id: 'if1', name: 'CMH Road', coords: [[12.9784, 77.6408], [12.9773, 77.6342], [12.9765, 77.6289]], distanceKm: 1.35, shadeFraction: 0.18 },
          { id: 'if2', name: 'Trinity corridor', coords: [[12.9765, 77.6289], [12.9751, 77.6191], [12.9745, 77.6123]], distanceKm: 2.2, shadeFraction: 0.16 },
          { id: 'if3', name: 'Cubbon entry', coords: [[12.9745, 77.6123], [12.9754, 77.6048], [12.9763, 77.5991]], distanceKm: 1.65, shadeFraction: 0.42 },
        ],
      },
      {
        id: 'balanced',
        label: 'Balanced Route',
        subtitle: 'Ulsoor lake edge',
        color: '#f59e0b',
        demoDistanceKm: 13.5,
        demoEtaMinutes: 25,
        demoShadeFraction: 0.38,
        uvDoseMultiplier: 0.97,
        segments: [
          { id: 'ib1', name: 'Defence Colony', coords: [[12.9784, 77.6408], [12.9812, 77.6328], [12.9819, 77.6254]], distanceKm: 1.75, shadeFraction: 0.46 },
          { id: 'ib2', name: 'Ulsoor lake', coords: [[12.9819, 77.6254], [12.9804, 77.6176], [12.9781, 77.6099]], distanceKm: 2.15, shadeFraction: 0.36 },
          { id: 'ib3', name: 'Park approach', coords: [[12.9781, 77.6099], [12.9769, 77.6043], [12.9763, 77.5991]], distanceKm: 1.35, shadeFraction: 0.55 },
        ],
      },
      {
        id: 'lowestUv',
        label: 'Lowest UV Route',
        subtitle: 'Cantonment shaded lanes',
        color: '#16a34a',
        demoDistanceKm: 16,
        demoEtaMinutes: 30,
        demoShadeFraction: 0.58,
        uvDoseMultiplier: 0.91,
        segments: [
          { id: 'iu1', name: 'Indiranagar canopy lanes', coords: [[12.9784, 77.6408], [12.9855, 77.6359], [12.9903, 77.6285]], distanceKm: 2.25, shadeFraction: 0.57 },
          { id: 'iu2', name: 'Cantonment shade', coords: [[12.9903, 77.6285], [12.9898, 77.6163], [12.9852, 77.6075]], distanceKm: 2.55, shadeFraction: 0.61 },
          { id: 'iu3', name: 'Cubbon north gate', coords: [[12.9852, 77.6075], [12.9804, 77.6031], [12.9763, 77.5991]], distanceKm: 1.55, shadeFraction: 0.68 },
        ],
      },
    ],
  },
  {
    id: 'jayanagar-city',
    origin: 'Jayanagar',
    destination: 'Bengaluru City Center',
    center: [12.9517, 77.5867],
    zoom: 13,
    routes: [
      {
        id: 'fastest',
        label: 'Fastest Route',
        subtitle: 'Lalbagh Road direct',
        color: '#ef4444',
        demoDistanceKm: 14.1,
        demoEtaMinutes: 22,
        demoShadeFraction: 0.2,
        uvDoseMultiplier: 1.15,
        segments: [
          { id: 'jf1', name: 'Jayanagar main road', coords: [[12.925, 77.583], [12.9333, 77.5841], [12.9417, 77.5854]], distanceKm: 2.05, shadeFraction: 0.24 },
          { id: 'jf2', name: 'Lalbagh Road exposed', coords: [[12.9417, 77.5854], [12.9516, 77.5864], [12.9602, 77.5865]], distanceKm: 2.3, shadeFraction: 0.15 },
          { id: 'jf3', name: 'Town Hall approach', coords: [[12.9602, 77.5865], [12.9666, 77.5869], [12.9716, 77.5946]], distanceKm: 1.55, shadeFraction: 0.21 },
        ],
      },
      {
        id: 'balanced',
        label: 'Balanced Route',
        subtitle: 'Basavanagudi mixed shade',
        color: '#f59e0b',
        demoDistanceKm: 13.5,
        demoEtaMinutes: 25,
        demoShadeFraction: 0.38,
        uvDoseMultiplier: 0.97,
        segments: [
          { id: 'jb1', name: 'Jayanagar 4th block', coords: [[12.925, 77.583], [12.9328, 77.5766], [12.9416, 77.5741]], distanceKm: 2.3, shadeFraction: 0.48 },
          { id: 'jb2', name: 'Basavanagudi', coords: [[12.9416, 77.5741], [12.9518, 77.5758], [12.9612, 77.5803]], distanceKm: 2.65, shadeFraction: 0.44 },
          { id: 'jb3', name: 'KR Market side', coords: [[12.9612, 77.5803], [12.9674, 77.5868], [12.9716, 77.5946]], distanceKm: 1.7, shadeFraction: 0.28 },
        ],
      },
      {
        id: 'lowestUv',
        label: 'Lowest UV Route',
        subtitle: 'Lalbagh canopy detour',
        color: '#16a34a',
        demoDistanceKm: 16,
        demoEtaMinutes: 30,
        demoShadeFraction: 0.58,
        uvDoseMultiplier: 0.91,
        segments: [
          { id: 'ju1', name: 'Jayanagar shaded streets', coords: [[12.925, 77.583], [12.9345, 77.5904], [12.9433, 77.5907]], distanceKm: 2.4, shadeFraction: 0.55 },
          { id: 'ju2', name: 'Lalbagh perimeter', coords: [[12.9433, 77.5907], [12.9538, 77.592], [12.9622, 77.5912]], distanceKm: 2.45, shadeFraction: 0.67 },
          { id: 'ju3', name: 'City center shade pockets', coords: [[12.9622, 77.5912], [12.9672, 77.5923], [12.9716, 77.5946]], distanceKm: 1.15, shadeFraction: 0.38 },
        ],
      },
    ],
  },
]

export const getJourneyByPair = (origin: string, destination: string) =>
  journeys.find((journey) => journey.origin === origin && journey.destination === destination) ?? journeys[0]
