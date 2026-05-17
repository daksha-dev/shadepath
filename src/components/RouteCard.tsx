import { Clock3, Leaf, Route, ShieldCheck, Sun } from 'lucide-react'
import type { ScoredRoute } from '../utils/routeScoring'

type Props = {
  route: ScoredRoute
  selected: boolean
  rank: number
  onSelect: () => void
}

export function RouteCard({ route, selected, rank, onSelect }: Props) {
  return (
    <button className={`route-card ${selected ? 'selected' : ''}`} type="button" onClick={onSelect}>
      <div className="route-card-top">
        <div>
          <span className="rank">#{rank}</span>
          <h3>{route.label}</h3>
          <p>{route.subtitle}</p>
        </div>
        <div className={`grade grade-${route.grade.toLowerCase()}`}>{route.grade}</div>
      </div>
      <div className="route-metrics">
        <span>
          <Clock3 size={15} /> {Math.round(route.etaMinutes)} min
        </span>
        <span>
          <Route size={15} /> {route.distanceKm.toFixed(1)} km
        </span>
        <span>
          <Sun size={15} /> {Math.round(route.totalDose)} UVI-min
        </span>
        <span>
          <Leaf size={15} /> {Math.round(route.shadedPercent)}% shade
        </span>
      </div>
      <div className="saved-line">
        <ShieldCheck size={16} />
        <strong>{Math.round(route.exposureSavedPercent)}%</strong> exposure saved vs fastest
      </div>
    </button>
  )
}
