import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { AlertTriangle, Building2, Leaf, MapPinned } from 'lucide-react'
import { cityActions, riskAreas, safestCorridors, worstCorridors } from '../data/mockHeatmap'

const riskColor = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
}

export function CityRiskMap() {
  return (
    <div className="city-risk-layout">
      <section className="city-map-card">
        <MapContainer center={[12.9716, 77.5946]} zoom={11} scrollWheelZoom className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {riskAreas.map((area) => (
            <CircleMarker
              key={area.id}
              center={area.position}
              radius={area.risk === 'high' ? 22 : area.risk === 'medium' ? 17 : 14}
              pathOptions={{ color: riskColor[area.risk], fillColor: riskColor[area.risk], fillOpacity: 0.35, weight: 2 }}
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
        </MapContainer>
      </section>
      <aside className="city-side-panel">
        <div className="panel-title">
          <MapPinned size={20} />
          <div>
            <p className="eyebrow">Institutional view</p>
            <h2>City UV risk corridors</h2>
          </div>
        </div>
        <div className="city-list danger">
          <h3><AlertTriangle size={17} /> Worst UV Corridors</h3>
          {worstCorridors.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="city-list safe">
          <h3><Leaf size={17} /> Safest Shade Corridors</h3>
          {safestCorridors.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="city-list action">
          <h3><Building2 size={17} /> Recommended city action</h3>
          {cityActions.map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    </div>
  )
}
