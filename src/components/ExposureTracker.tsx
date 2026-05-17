import { CalendarDays, Flame, ShieldCheck, TimerReset } from 'lucide-react'
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
    <section className="insight-card tracker-card">
      <div className="card-heading">
        <ShieldCheck size={20} />
        <div>
          <p className="eyebrow">Exposure saved tracker</p>
          <h3>{avoided} UVI-min avoided today</h3>
        </div>
      </div>
      <div className="tracker-grid">
        <span><CalendarDays size={17} /> <strong>{weekly}</strong> weekly saved</span>
        <span><Flame size={17} /> <strong>{streak} days</strong> streak</span>
        <span><TimerReset size={17} /> <strong>{safestOffset === 0 ? 'Now' : `+${safestOffset} min`}</strong> safest departure</span>
      </div>
    </section>
  )
}
