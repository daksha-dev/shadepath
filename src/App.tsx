import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Building2, Map as MapIcon, Truck } from 'lucide-react'
import { CityRiskLayers } from './components/CityRiskLayers'
import { CityRiskPanel } from './components/CityRiskPanel'
import { ExposureTracker } from './components/ExposureTracker'
import { FleetDashboard } from './components/FleetDashboard'
import { GearRecommendation } from './components/GearRecommendation'
import { PlannerLayers } from './components/PlannerLayers'
import { ProfileControls } from './components/ProfileControls'
import { RouteCard } from './components/RouteCard'
import { journeys, type JourneyId, type Mode } from './data/bangaloreRoutes'
import { fetchBengaluruUv } from './utils/openMeteo'
import { safestDepartureInsight, scoreRoutes } from './utils/routeScoring'
import { demoDepartureHour, fallbackUv, type UserProfile, type UvTimeMode, type UvWeather } from './utils/uvDose'
import './index.css'
import 'leaflet/dist/leaflet.css'

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

  return (
    <div className="app-shell">
      {/* Absolute Map Background */}
      <div className="map-background">
        <MapContainer center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={true} zoomControl={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {activeTab === 'planner' && (
            <PlannerLayers
              journey={journey}
              routes={routes}
              selectedRouteId={selectedRoute.id}
              onSelectRoute={setSelectedRouteId}
            />
          )}
          {activeTab === 'areas' && <CityRiskLayers />}
        </MapContainer>
      </div>

      {/* Vertical Dock */}
      <nav className="dock">
        <div className="brand-mark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        <button className={`dock-button ${activeTab === 'planner' ? 'active' : ''}`} onClick={() => setActiveTab('planner')} title="Route Planner">
          <MapIcon size={20} strokeWidth={1.5} />
        </button>
        <button className={`dock-button ${activeTab === 'areas' ? 'active' : ''}`} onClick={() => setActiveTab('areas')} title="City Risk">
          <Building2 size={20} strokeWidth={1.5} />
        </button>
        <button className={`dock-button ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => setActiveTab('fleet')} title="Fleet Demo">
          <Truck size={20} strokeWidth={1.5} />
        </button>
      </nav>

      {/* Floating UI Layer */}
      <main className="ui-layer">
        {activeTab === 'planner' && (
          <>
            <ProfileControls
              journeyId={journeyId}
              mode={mode}
              departureOffset={departureOffset}
              timeMode={timeMode}
              profile={profile}
              onJourneyChange={(id) => {
                setJourneyId(id)
                setSelectedRouteId('lowestUv')
              }}
              onModeChange={setMode}
              onDepartureChange={setDepartureOffset}
              onTimeModeChange={setTimeMode}
              onProfileChange={setProfile}
              onAnalyze={() => {}}
            />

            <div className="col-span-3 route-grid" style={{ pointerEvents: 'auto' }}>
              <div className="panel" style={{ marginBottom: '24px' }}>
                <p className="label" style={{ color: 'var(--moss)' }}>Recommendation</p>
                <div style={{ marginTop: '8px' }}>
                  <strong style={{ fontSize: '0.875rem' }}>{selectedRoute.label} is safest. </strong>
                  <span style={{ fontSize: '0.875rem', color: 'var(--slate)' }}>
                    {departureOffset > 0
                      ? `Leaving ${departureOffset}m later reduces UV dose by ${Math.round(departureSavings)}%.`
                      : `Saves ${Math.round(selectedRoute.exposureSaved)} UVI-min vs fastest.`}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--slate)', marginTop: '8px' }}>
                  The fastest route is not always the safest. ArkaWay recommends trading a few extra minutes for lower UV exposure.
                </p>
              </div>

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

            <div className="col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '24px', pointerEvents: 'auto' }}>
              <ExposureTracker route={selectedRoute} safestOffset={safest.offset} />
              <GearRecommendation route={selectedRoute} mode={mode} profile={profile} />
            </div>
          </>
        )}

        {activeTab === 'areas' && <CityRiskPanel />}

        {activeTab === 'fleet' && <FleetDashboard />}
      </main>
    </div>
  )
}

export default App
