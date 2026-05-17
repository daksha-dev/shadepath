import { MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Journey } from '../data/bangaloreRoutes'
import type { ScoredRoute } from '../utils/routeScoring'

type Props = {
  journey: Journey
  routes: ScoredRoute[]
  selectedRouteId: string
  onSelectRoute: (routeId: string) => void
}

const riskColors = {
  low: '#22c55e',
  medium: '#facc15',
  high: '#ef4444',
}

function MapFocus({ journey }: { journey: Journey }) {
  const map = useMap()
  map.setView(journey.center, journey.zoom)
  return null
}

export function MapView({ journey, routes, selectedRouteId, onSelectRoute }: Props) {
  return (
    <div className="map-shell">
      <MapContainer center={journey.center} zoom={journey.zoom} scrollWheelZoom className="map">
        <MapFocus journey={journey} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routes.map((route) =>
          route.scoredSegments.map((segment) => (
            <Polyline
              key={`${route.id}-${segment.id}`}
              positions={segment.coords}
              pathOptions={{
                color: riskColors[segment.risk],
                weight: selectedRouteId === route.id ? 9 : 5,
                opacity: selectedRouteId === route.id ? 0.95 : 0.56,
              }}
              eventHandlers={{ click: () => onSelectRoute(route.id) }}
            >
              <Popup>
                <strong>{route.label}</strong>
                <br />
                {segment.name}
                <br />
                {Math.round(segment.dose)} UVI-min, {Math.round(segment.shadeFraction * 100)}% shade
              </Popup>
            </Polyline>
          )),
        )}
      </MapContainer>
      <div className="map-legend">
        <span><i className="risk-low" /> Low segment dose</span>
        <span><i className="risk-medium" /> Medium</span>
        <span><i className="risk-high" /> High</span>
      </div>
    </div>
  )
}
