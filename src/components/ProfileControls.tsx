import { Bike, Clock, Footprints, PersonStanding, Shield, Shirt, SunMedium } from 'lucide-react'
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
  'two-wheeler': <Bike size={17} />,
  cycle: <Bike size={17} />,
  walk: <PersonStanding size={17} />,
  jog: <Footprints size={17} />,
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
    <aside className="control-panel">
      <div>
        <p className="eyebrow">Route planner</p>
        <h2>UV-safe commute analysis</h2>
      </div>

      <label className="field">
        <span>Origin</span>
        <select value={selectedJourney.id} onChange={(event) => onJourneyChange(event.target.value as JourneyId)}>
          {journeys.map((journey) => (
            <option key={`${journey.id}-origin`} value={journey.id}>
              {journey.origin}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Destination</span>
        <select value={selectedJourney.id} onChange={(event) => onJourneyChange(event.target.value as JourneyId)}>
          {journeys.map((journey) => (
            <option key={`${journey.id}-destination`} value={journey.id}>
              {journey.destination}
            </option>
          ))}
        </select>
      </label>

      <div className="field">
        <span>Mode</span>
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
              <span>{modeLabels[modeKey]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>
          <Clock size={15} /> Time mode
        </span>
        <div className="segmented time-mode-toggle">
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

      <div className="field">
        <span>
          <Clock size={15} /> Departure
        </span>
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
          <strong>
            {departureOffset === 0 ? (timeMode === 'demo' ? '11:30 AM' : 'Leave now') : `+${departureOffset} min`}
          </strong>
          <span>+120</span>
        </div>
      </div>

      <div className="field">
        <span>Skin type: {profile.skinType}</span>
        <input
          type="range"
          min={1}
          max={6}
          value={profile.skinType}
          onChange={(event) => onProfileChange({ ...profile, skinType: Number(event.target.value) })}
        />
      </div>

      <div className="field">
        <span>
          <Shirt size={15} /> Sleeves
        </span>
        <div className="segmented">
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

      <div className="inline-setting">
        <span>
          <Shield size={16} /> Helmet
        </span>
        <button
          type="button"
          className={`toggle ${profile.helmet ? 'active' : ''}`}
          title="Toggle helmet"
          onClick={() => onProfileChange({ ...profile, helmet: !profile.helmet })}
        >
          <i />
        </button>
      </div>

      <div className="field">
        <span>
          <SunMedium size={15} /> Sunscreen SPF
        </span>
        <div className="segmented">
          {([0, 15, 30, 50] as const).map((spf) => (
            <button
              key={spf}
              type="button"
              className={profile.sunscreenSpf === spf ? 'active' : ''}
              onClick={() => onProfileChange({ ...profile, sunscreenSpf: spf })}
            >
              {spf}
            </button>
          ))}
        </div>
      </div>

      <button className="primary-action" type="button" onClick={onAnalyze}>
        Analyze UV-Safe Routes
      </button>
    </aside>
  )
}
