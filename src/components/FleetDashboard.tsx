import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const riders = [
  { name: 'R-104', dose: 612 },
  { name: 'R-087', dose: 588 },
  { name: 'R-219', dose: 554 },
  { name: 'R-132', dose: 527 },
  { name: 'R-076', dose: 503 },
]

export const hotspotsData = [
  { name: 'Outer Ring Road', coords: [12.9229, 77.6836] },
  { name: 'Silk Board', coords: [12.9176, 77.6235] },
  { name: 'Marathahalli', coords: [12.9569, 77.7011] },
  { name: 'Whitefield Main Road', coords: [12.9698, 77.7499] },
  { name: 'KR Market', coords: [12.9650, 77.5759] }
]

type Props = {
  onHoverHotspot: (name: string | null) => void
}

export function FleetDashboard({ onHoverHotspot }: Props) {
  return (
    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', width: '100%', pointerEvents: 'none', height: 'calc(100vh - 48px)' }}>
      {/* Left Column */}
      <div className="scrollable-col" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '24px', pointerEvents: 'auto' }}>
        <section className="panel" style={{ width: '100%' }}>
          <div>
            <p className="label">B2B fleet demo</p>
            <h2>Shift planning</h2>
          </div>
          
          <div className="data-list">
            <div className="data-list-item">
              <span className="label" style={{ color: 'var(--cobalt)' }}>Delivery riders</span>
              <span className="tabular" style={{ fontWeight: 500, color: 'var(--cobalt)' }}>128</span>
            </div>
            <div className="data-list-item">
              <span className="label" style={{ color: 'var(--cobalt)' }}>Avg dose / shift</span>
              <span className="tabular" style={{ fontWeight: 500, color: 'var(--cobalt)' }}>286 UVI-m</span>
            </div>
            <div className="data-list-item">
              <span className="label" style={{ color: 'var(--cobalt)' }}>Simulated reduction</span>
              <span className="tabular" style={{ fontWeight: 500, color: 'var(--moss)' }}>-31%</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--hairline)' }}>
            <h3>Simulation insight</h3>
            <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
              Shifting 1-hour delivery window reduces fleet UV dose by 31%. 
              Compares current dispatch peaks against a cooler 10:30 AM and 4:30 PM split window.
            </p>
          </div>
        </section>

        <section className="panel" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div>
            <p className="label">Exposure</p>
            <h2 style={{ whiteSpace: 'normal', wordBreak: 'normal' }}>Daily UV dose by rider</h2>
          </div>
          <div style={{ flex: 1, minHeight: '300px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riders} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#E4E2DC" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5C5C58', fontSize: 12, fontFamily: 'monospace' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5C5C58', fontSize: 12, fontFamily: 'monospace' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f4f4f0' }} 
                  contentStyle={{ borderRadius: '2px', border: '1px solid #1B1B1A', boxShadow: 'none' }} 
                />
                <Bar 
                  dataKey="dose" 
                  fill="transparent" 
                  stroke="#D6362A" 
                  strokeWidth={1} 
                  radius={[0, 0, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="scrollable-col" style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '24px', pointerEvents: 'auto' }}>
        <section className="panel" style={{ width: '100%' }}>
          <div>
            <p className="label">Corridors</p>
            <h2>Overexposure hotspots</h2>
          </div>
          
          <div className="data-list danger">
            {hotspotsData.map((hotspot, index) => (
              <div 
                className="data-list-item" 
                key={hotspot.name}
                onMouseEnter={() => onHoverHotspot(hotspot.name)}
                onMouseLeave={() => onHoverHotspot(null)}
                style={{ cursor: 'pointer', transition: 'background 150ms', padding: '8px 4px', margin: '0 -4px', borderRadius: '4px' }}
              >
                <span className="rank tabular" style={{ color: 'var(--cobalt)' }}>{index + 1}</span>
                <span className="name" style={{ color: 'var(--graphite)' }}>{hotspot.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
