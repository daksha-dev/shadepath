import type { ScoredRoute } from '../utils/routeScoring'

type Props = {
  route: ScoredRoute
  safestOffset: number
}

export function ExposureTracker({ route, safestOffset }: Props) {
  const avoided = Math.round(route.exposureSaved)
  const weekly = avoided * 5 + 140
  const streak = Math.max(4, Math.round(6 + route.exposureSavedPercent / 14))

  return (
    <section className="panel right-card">
      <div>
        <p className="label">Exposure tracker</p>
        <h2 style={{ color: avoided > 0 ? 'var(--moss)' : 'var(--cobalt)' }}>{avoided} UVI-min avoided today</h2>
      </div>
      <div className="data-grid">
        <div className="data-block safe">
          <p className="label">Weekly saved</p>
          <div className="value tabular">{weekly}</div>
        </div>
        <div className="data-block safe">
          <p className="label">Streak</p>
          <div className="value tabular">{streak} days</div>
        </div>
        <div className="data-block col-span-2">
          <p className="label">Safest departure</p>
          <div className="value tabular">{safestOffset === 0 ? 'Now' : `+${safestOffset}m`}</div>
        </div>
      </div>
    </section>
  )
}
