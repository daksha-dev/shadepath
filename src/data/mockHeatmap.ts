import type { LatLng } from './bangaloreRoutes'

export type RiskArea = {
  id: string
  name: string
  position: LatLng
  risk: 'high' | 'medium' | 'low'
  score: number
  note: string
}

export const riskAreas: RiskArea[] = [
  { id: 'orr', name: 'Outer Ring Road', position: [12.9359, 77.6974], risk: 'high', score: 91, note: 'Wide exposed corridor, slow mid-day two-wheeler traffic.' },
  { id: 'whitefield', name: 'Whitefield Main Road', position: [12.9698, 77.7499], risk: 'high', score: 87, note: 'Long signal waits and limited canopy.' },
  { id: 'silk', name: 'Silk Board', position: [12.9177, 77.6238], risk: 'high', score: 84, note: 'Congestion amplifies exposure minutes.' },
  { id: 'marathahalli', name: 'Marathahalli', position: [12.9569, 77.7011], risk: 'high', score: 82, note: 'Exposed junction and delivery concentration.' },
  { id: 'cubbon', name: 'Cubbon Park', position: [12.9763, 77.5991], risk: 'low', score: 24, note: 'Dense canopy lowers route-level dose.' },
  { id: 'lalbagh', name: 'Lalbagh', position: [12.9507, 77.5848], risk: 'low', score: 29, note: 'Green perimeter creates safer detours.' },
  { id: 'malleshwaram', name: 'Malleshwaram residential', position: [13.0068, 77.5683], risk: 'low', score: 34, note: 'Tree-lined residential corridors.' },
  { id: 'richmond', name: 'Richmond Town', position: [12.9617, 77.6076], risk: 'medium', score: 55, note: 'Mixed shade with exposed arterial cuts.' },
  { id: 'koramangala', name: 'Koramangala 80 ft Road', position: [12.9352, 77.6245], risk: 'medium', score: 63, note: 'Commercial pockets need shade structures.' },
]

export const worstCorridors = ['Outer Ring Road', 'Whitefield Main Road', 'Silk Board', 'Marathahalli']
export const safestCorridors = ['Cubbon Park', 'Lalbagh', 'Malleshwaram residential lanes', 'Richmond shaded side streets']
export const cityActions = [
  'Add shade structures near exposed two-wheeler corridors.',
  'Prioritize tree canopy around school commute routes.',
  'Shift delivery windows away from 12 PM-3 PM.',
]
