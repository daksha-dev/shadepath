import { Droplets, Glasses, ShieldPlus, Shirt } from 'lucide-react'
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
    <section className="insight-card gear-card">
      <div className="card-heading">
        <ShieldPlus size={20} />
        <div>
          <p className="eyebrow">Gear recommendation</p>
          <h3>Peak effective UVI {route.peakEffectiveUv.toFixed(1)}</h3>
        </div>
      </div>
      <p className="recommendation-copy">
        Peak effective UVI is {route.peakEffectiveUv.toFixed(1)} during a {Math.round(route.etaMinutes)}-minute{' '}
        {modeLabels[mode].toLowerCase()} ride. Use SPF {spf}, {needsSleeves ? 'long sleeves' : 'current sleeves are ok'},
        {needsVisor ? ' UV visor or sunglasses' : ' helmet visor'}, and {hydration} ml hydration.
      </p>
      <div className="recommendation-grid">
        <span><ShieldPlus size={16} /> SPF {Math.max(spf, profile.sunscreenSpf)}</span>
        <span><Shirt size={16} /> {needsSleeves ? 'Long sleeves' : 'Sleeves set'}</span>
        <span><Glasses size={16} /> UV visor</span>
        <span><Droplets size={16} /> {hydration} ml</span>
      </div>
    </section>
  )
}
