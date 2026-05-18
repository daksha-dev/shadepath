import { Polyline, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import type { Journey } from '../data/bangaloreRoutes'
import type { ScoredRoute } from '../utils/routeScoring'

type Props = {
  journey: Journey
  routes: ScoredRoute[]
  selectedRouteId: string
  onSelectRoute: (routeId: string) => void
}

const riskColors = {
  low: '#4B6B3C', // --moss
  medium: '#5C5C58', // --slate
  high: '#D6362A', // --signal
}

export function PlannerLayers({ journey, routes, selectedRouteId, onSelectRoute }: Props) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(journey.center, journey.zoom, { duration: 0.25 })
  }, [journey.center, journey.zoom, map])

  return (
    <>
      {routes.map((route) =>
        route.scoredSegments.map((segment) => (
          <Polyline
            key={`${route.id}-${segment.id}`}
            positions={segment.coords}
            pathOptions={{
              color: selectedRouteId === route.id ? '#1F4E79' : riskColors[segment.risk],
              weight: selectedRouteId === route.id ? 9 : 3,
              opacity: selectedRouteId === route.id ? 1 : 0.4,
              className: 'animated-route', // Let's add a CSS class to animate if possible
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
    </>
  )
}
