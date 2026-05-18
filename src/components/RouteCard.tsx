import type { ScoredRoute } from '../utils/routeScoring'

type Props = {
  route: ScoredRoute
  selected: boolean
  rank: number
  onSelect: () => void
}

export function RouteCard({ route, selected, rank, onSelect }: Props) {
  return (
    <button className={`route-row ${selected ? 'selected' : ''}`} type="button" onClick={onSelect}>
      <div className="route-rank tabular">{(rank).toString().padStart(2, '0')}</div>
      <div style={{ textAlign: 'left' }}>
        <h3>{route.label}</h3>
        <p>{Math.round(route.exposureSavedPercent)}% saved · {Math.round(route.shadedPercent)}% shade</p>
      </div>
      <div className="route-metrics">
        <span className="dose tabular">{Math.round(route.totalDose)} UVI-min</span>
        <span className="time tabular">{Math.round(route.etaMinutes)} min</span>
      </div>
    </button>
  )
}
