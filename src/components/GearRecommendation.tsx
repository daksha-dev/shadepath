import { modeLabels, type Mode } from '../data/bangaloreRoutes'
import type { ScoredRoute } from '../utils/routeScoring'
import type { UserProfile } from '../utils/uvDose'

type Props = {
  route: ScoredRoute
  mode: Mode
  profile: UserProfile
}

export function GearRecommendation({ route, mode, profile }: Props) {
  const spf = route.peakEffectiveUv > 5 || route.totalDose > 120 ? 50 : 30
  const hydration = Math.round(Math.max(300, route.etaMinutes * (mode === 'jog' ? 28 : mode === 'cycle' ? 22 : 16)) / 50) * 50
  const needsSleeves = profile.sleeves !== 'long' && route.totalDose > 85
  const needsVisor = route.peakEffectiveUv > 4.5 || !profile.helmet

  return (
    <section className="panel right-card">
      <div>
        <p className="label">Gear recommendation</p>
        <h2 style={{ color: 'var(--cobalt)' }}>Peak UVI {route.peakEffectiveUv.toFixed(1)}</h2>
      </div>
      <p style={{ fontSize: '0.875rem' }}>
        For a {Math.round(route.etaMinutes)}-minute {modeLabels[mode].toLowerCase()} ride.
      </p>
      
      <div className="data-grid">
        <div className="data-block">
          <p className="label">SPF needed</p>
          <div className="value tabular">{Math.max(spf, profile.sunscreenSpf)}</div>
        </div>
        <div className="data-block">
          <p className="label">Hydration</p>
          <div className="value tabular">{hydration}ml</div>
        </div>
        <div className="data-block col-span-2">
          <p className="label">Equipment</p>
          <div style={{ fontSize: '0.875rem' }}>
            {needsSleeves ? 'Long sleeves, ' : ''}
            {needsVisor ? 'UV visor' : 'Helmet visor'}
          </div>
        </div>
      </div>
    </section>
  )
}
