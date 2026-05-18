import { CircleMarker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { riskAreas } from '../data/mockHeatmap'

const riskColor = {
  high: '#D6362A',   // --signal
  medium: '#5C5C58', // --slate
  low: '#4B6B3C',    // --moss
}

export function CityRiskLayers() {
  const map = useMap()

  useEffect(() => {
    map.flyTo([12.9716, 77.5946], 11, { duration: 0.25 })
  }, [map])

  return (
    <>
      {riskAreas.map((area) => (
        <CircleMarker
          key={area.id}
          center={area.position}
          radius={area.risk === 'high' ? 22 : area.risk === 'medium' ? 17 : 14}
          pathOptions={{ 
            color: riskColor[area.risk], 
            fillColor: riskColor[area.risk], 
            fillOpacity: 0.15, 
            weight: 1 
          }}
        >
          <Popup>
            <strong>{area.name}</strong>
            <br />
            Risk score {area.score}
            <br />
            {area.note}
          </Popup>
        </CircleMarker>
      ))}
    </>
  )
}
