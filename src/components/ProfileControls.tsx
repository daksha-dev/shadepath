import { Bike, Footprints, PersonStanding } from 'lucide-react'
import { journeys, modeLabels, type JourneyId, type Mode } from '../data/bangaloreRoutes'
import type { UserProfile, UvTimeMode } from '../utils/uvDose'

type Props = {
  journeyId: JourneyId
  mode: Mode
  departureOffset: number
  timeMode: UvTimeMode
  profile: UserProfile
  onJourneyChange: (journeyId: JourneyId) => void
  onModeChange: (mode: Mode) => void
  onDepartureChange: (offset: number) => void
  onTimeModeChange: (timeMode: UvTimeMode) => void
  onProfileChange: (profile: UserProfile) => void
  onAnalyze: () => void
}

const modeIcons: Record<Mode, React.ReactNode> = {
  'two-wheeler': <Bike size={18} strokeWidth={1.5} />,
  cycle: <Bike size={18} strokeWidth={1.5} />,
  walk: <PersonStanding size={18} strokeWidth={1.5} />,
  jog: <Footprints size={18} strokeWidth={1.5} />,
}

export function ProfileControls({
  journeyId,
  mode,
  departureOffset,
  timeMode,
  profile,
  onJourneyChange,
  onModeChange,
  onDepartureChange,
  onTimeModeChange,
  onProfileChange,
  onAnalyze,
}: Props) {
  const selectedJourney = journeys.find((journey) => journey.id === journeyId) ?? journeys[0]

  return (
    <aside className="panel col-span-3">
      <div>
        <p className="label">Route planner</p>
        <h2>Commute analysis</h2>
      </div>

      <div className="input-group">
        <label className="label">Origin</label>
        <select className="select-base" value={selectedJourney.id} onChange={(event) => onJourneyChange(event.target.value as JourneyId)}>
          {journeys.map((journey) => (
            <option key={`${journey.id}-origin`} value={journey.id}>
              {journey.origin}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label className="label">Destination</label>
        <select className="select-base" value={selectedJourney.id} onChange={(event) => onJourneyChange(event.target.value as JourneyId)}>
          {journeys.map((journey) => (
            <option key={`${journey.id}-destination`} value={journey.id}>
              {journey.destination}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label className="label">Mode</label>
        <div className="mode-grid">
          {(Object.keys(modeLabels) as Mode[]).map((modeKey) => (
            <button
              key={modeKey}
              className={mode === modeKey ? 'active' : ''}
              type="button"
              title={modeLabels[modeKey]}
              onClick={() => onModeChange(modeKey)}
            >
              {modeIcons[modeKey]}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label className="label">Time mode</label>
        <div className="mode-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {([
            ['demo', 'Demo Daytime'],
            ['live', 'Live Time'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={timeMode === value ? 'active' : ''}
              onClick={() => onTimeModeChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label className="label">Departure</label>
        <input
          type="range"
          min={0}
          max={120}
          step={30}
          value={departureOffset}
          onChange={(event) => onDepartureChange(Number(event.target.value))}
        />
        <div className="range-labels">
          <span>{timeMode === 'demo' ? '11:30 AM' : 'Now'}</span>
          <strong className="tabular">
            {departureOffset === 0 ? (timeMode === 'demo' ? '11:30 AM' : 'Leave now') : `+${departureOffset}m`}
          </strong>
          <span>+120m</span>
        </div>
      </div>

      <div className="input-group">
        <label className="label">Skin type: {profile.skinType}</label>
        <input
          type="range"
          min={1}
          max={6}
          value={profile.skinType}
          onChange={(event) => onProfileChange({ ...profile, skinType: Number(event.target.value) })}
        />
      </div>

      <div className="input-group">
        <label className="label">Sleeves</label>
        <div className="mode-grid">
          {(['none', 'short', 'long'] as const).map((sleeves) => (
            <button
              key={sleeves}
              type="button"
              className={profile.sleeves === sleeves ? 'active' : ''}
              onClick={() => onProfileChange({ ...profile, sleeves })}
            >
              {sleeves}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-row">
        <label className="label">Helmet</label>
        <button
          type="button"
          className={`square-toggle ${profile.helmet ? 'active' : ''}`}
          title="Toggle helmet"
          onClick={() => onProfileChange({ ...profile, helmet: !profile.helmet })}
        />
      </div>

      <div className="input-group">
        <label className="label">Sunscreen SPF</label>
        <div className="mode-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          {([0, 15, 30, 50] as const).map((spf) => (
            <button
              key={spf}
              type="button"
              className={profile.sunscreenSpf === spf ? 'active tabular' : 'tabular'}
              onClick={() => onProfileChange({ ...profile, sunscreenSpf: spf })}
            >
              {spf}
            </button>
          ))}
        </div>
      </div>

      <button className="btn" type="button" onClick={onAnalyze}>
        Analyze routes
      </button>
    </aside>
  )
}
