import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const riders = [
  { name: 'R-104', dose: 612 },
  { name: 'R-087', dose: 588 },
  { name: 'R-219', dose: 554 },
  { name: 'R-132', dose: 527 },
  { name: 'R-076', dose: 503 },
]

const hotspots = ['Outer Ring Road', 'Silk Board', 'Marathahalli', 'Whitefield Main Road', 'KR Market']

export function FleetDashboard() {
  return (
    <>
      <section className="panel col-span-3">
        <div>
          <p className="label">B2B fleet demo</p>
          <h2>Shift planning</h2>
        </div>
        
        <div className="data-list">
          <div className="data-list-item">
            <span className="label">Delivery riders</span>
            <span className="tabular" style={{ fontWeight: 500 }}>128</span>
          </div>
          <div className="data-list-item">
            <span className="label">Avg dose / shift</span>
            <span className="tabular" style={{ fontWeight: 500 }}>286 UVI-m</span>
          </div>
          <div className="data-list-item">
            <span className="label">Simulated reduction</span>
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

      <section className="panel col-span-6">
        <div>
          <p className="label">Exposure</p>
          <h2>Daily UV dose by rider</h2>
        </div>
        <div style={{ flex: 1, minHeight: '300px' }}>
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

      <section className="panel col-span-3">
        <div>
          <p className="label">Corridors</p>
          <h2>Overexposure hotspots</h2>
        </div>
        
        <div className="data-list danger">
          {hotspots.map((hotspot, index) => (
            <div className="data-list-item" key={hotspot}>
              <span className="rank tabular">{index + 1}</span>
              <span className="name">{hotspot}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
