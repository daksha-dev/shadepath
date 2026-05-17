import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Building2, Map, Sparkles, SunMedium, Truck } from 'lucide-react'
import { CityRiskMap } from './components/CityRiskMap'
import { ExposureTracker } from './components/ExposureTracker'
import { FleetDashboard } from './components/FleetDashboard'
import { GearRecommendation } from './components/GearRecommendation'
import { MapView } from './components/MapView'
import { ProfileControls } from './components/ProfileControls'
import { RouteCard } from './components/RouteCard'
import { journeys, modeLabels, type JourneyId, type Mode } from './data/bangaloreRoutes'
import { fetchBengaluruUv } from './utils/openMeteo'
import { safestDepartureInsight, scoreRoutes } from './utils/routeScoring'
import { demoDepartureHour, fallbackUv, type UserProfile, type UvTimeMode, type UvWeather } from './utils/uvDose'
import './index.css'

type Tab = 'planner' | 'areas' | 'fleet'

const initialProfile: UserProfile = {
  skinType: 2,
  sleeves: 'short',
  helmet: true,
  sunscreenSpf: 0,
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('planner')
  const [journeyId, setJourneyId] = useState<JourneyId>('koramangala-mg-road')
  const [mode, setMode] = useState<Mode>('two-wheeler')
  const [departureOffset, setDepartureOffset] = useState(0)
  const [timeMode, setTimeMode] = useState<UvTimeMode>('demo')
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [weather, setWeather] = useState<UvWeather>(fallbackUv)
  const [selectedRouteId, setSelectedRouteId] = useState('lowestUv')
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    fetchBengaluruUv(timeMode).then(setWeather)
  }, [timeMode])

  const baseDepartureHour = useMemo(() => {
    if (timeMode === 'demo') return demoDepartureHour

    const now = new Date()
    return now.getHours() + now.getMinutes() / 60
  }, [timeMode])

  const journey = journeys.find((item) => item.id === journeyId) ?? journeys[0]
  const routes = useMemo(
    () => scoreRoutes(journey.routes, mode, profile, weather, departureOffset, baseDepartureHour),
    [journey.routes, mode, profile, weather, departureOffset, baseDepartureHour],
  )

  const selectedRoute = routes.find((route) => route.id === selectedRouteId) ?? routes[0]
  const nowRoute = useMemo(() => scoreRoutes(journey.routes, mode, profile, weather, 0, baseDepartureHour).find((route) => route.id === selectedRoute.id), [
    baseDepartureHour,
    journey.routes,
    mode,
    profile,
    selectedRoute.id,
    weather,
  ])
  const futureRoute = routes.find((route) => route.id === selectedRoute.id)
  const departureSavings =
    nowRoute && futureRoute && departureOffset > 0 ? Math.max(0, ((nowRoute.totalDose - futureRoute.totalDose) / nowRoute.totalDose) * 100) : 0
  const safest = safestDepartureInsight(journey.routes, mode, profile, weather, selectedRoute.id, baseDepartureHour)
  const sourceLabel =
    timeMode === 'demo'
      ? 'Demo mode: Bengaluru UV exposure shown for an 11:30 AM commute'
      : weather.source === 'Open-Meteo'
        ? 'Live UV source: Open-Meteo'
        : 'Using demo UV data'

  const tabButtons = [
    { id: 'planner' as const, label: 'Route Planner', icon: <Map size={18} /> },
    { id: 'areas' as const, label: 'City Risk', icon: <Building2 size={18} /> },
    { id: 'fleet' as const, label: 'Fleet Demo', icon: <Truck size={18} /> },
  ]

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <div className="brand-mark"><SunMedium size={27} /></div>
          <div>
            <p className="eyebrow">ArkaWay</p>
            <h1>UV-dose-aware routing for Bengaluru commuters</h1>
          </div>
        </div>
        <div className="header-metrics">
          <span><Activity size={18} /> {timeMode === 'demo' ? 'Demo UV' : 'Live UV'} {weather.uvIndex.toFixed(1)}</span>
          <span>{sourceLabel}</span>
        </div>
      </header>

      <nav className="tabs">
        {tabButtons.map((tab) => (
          <button key={tab.id} type="button" className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'planner' && (
        <main className="planner-layout">
          <ProfileControls
            journeyId={journeyId}
            mode={mode}
            departureOffset={departureOffset}
            timeMode={timeMode}
            profile={profile}
            onJourneyChange={(nextJourneyId) => {
              setJourneyId(nextJourneyId)
              setSelectedRouteId('lowestUv')
            }}
            onModeChange={setMode}
            onDepartureChange={setDepartureOffset}
            onTimeModeChange={setTimeMode}
            onProfileChange={setProfile}
            onAnalyze={() => setPulse((value) => value + 1)}
          />

          <section className="main-dashboard">
            <motion.div key={`${selectedRoute.id}-${pulse}`} initial={{ opacity: 0.75, y: 8 }} animate={{ opacity: 1, y: 0 }} className="recommendation-banner">
              <Sparkles size={19} />
              <div>
                <strong>{selectedRoute.label} recommended for lowest UV exposure.</strong>
                <span>
                  {departureOffset > 0
                    ? `Leaving ${departureOffset} minutes later reduces estimated UV dose by ${Math.round(departureSavings)}%.`
                    : `Current route saves ${Math.round(selectedRoute.exposureSaved)} UVI-min versus the fastest option.`}
                </span>
                <small>
                  The fastest route is not always the safest route. ArkaWay recommends a route that trades a few extra minutes for lower UV
                  exposure.
                </small>
              </div>
            </motion.div>

            <MapView journey={journey} routes={routes} selectedRouteId={selectedRoute.id} onSelectRoute={setSelectedRouteId} />

            <div className="route-card-grid">
              {routes.map((route, index) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  selected={selectedRoute.id === route.id}
                  rank={index + 1}
                  onSelect={() => setSelectedRouteId(route.id)}
                />
              ))}
            </div>
          </section>

          <aside className="right-rail">
            <section className="uv-card">
              <p className="eyebrow">{timeMode === 'demo' ? 'Demo daytime snapshot' : 'Open-Meteo snapshot'}</p>
              <div className="uv-number">{weather.uvIndex.toFixed(1)}</div>
              <span className="uv-disclaimer">Prototype demo uses selected daytime UV forecast to demonstrate route-level exposure logic.</span>
              {timeMode === 'demo' && weather.source === 'Demo' && <span>Using fallback demo UV data</span>}
              <span>Clear sky {weather.uvClearSky.toFixed(1)} · Cloud cover {Math.round(weather.cloudCover)}%</span>
              <small>{modeLabels[mode]} profile · {journey.origin} to {journey.destination}</small>
            </section>
            <GearRecommendation route={selectedRoute} mode={mode} profile={profile} />
            <ExposureTracker route={selectedRoute} safestOffset={safest.offset} />
          </aside>
        </main>
      )}

      {activeTab === 'areas' && <CityRiskMap />}
      {activeTab === 'fleet' && <FleetDashboard />}

      <footer>
        Prototype uses simulated route shade data for demonstration. Prototype demo uses selected daytime UV forecast to demonstrate route-level exposure logic. Production version will integrate route APIs, OSM canopy/building data, and validated UV exposure models.
      </footer>
    </div>
  )
}

export default App
