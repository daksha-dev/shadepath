import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Bike, Clock3, MapPinned, TrendingDown, Users } from 'lucide-react'

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
    <div className="fleet-layout">
      <section className="fleet-hero">
        <div>
          <p className="eyebrow">B2B fleet demo</p>
          <h2>Shift planning that lowers rider UV dose</h2>
        </div>
        <div className="fleet-stat-row">
          <span><Users size={21} /> <strong>128</strong> delivery riders</span>
          <span><Bike size={21} /> <strong>286</strong> avg UVI-min / shift</span>
          <span><TrendingDown size={21} /> <strong>31%</strong> simulated reduction</span>
        </div>
      </section>

      <section className="fleet-card chart-card">
        <div className="card-heading">
          <Clock3 size={20} />
          <div>
            <p className="eyebrow">Top 5 high-exposure riders</p>
            <h3>Daily UV dose by rider</h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={riders}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe4df" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="dose" radius={[8, 8, 0, 0]} fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="fleet-card hotspots-card">
        <div className="card-heading">
          <MapPinned size={20} />
          <div>
            <p className="eyebrow">Hotspot corridors</p>
            <h3>Where riders overexpose</h3>
          </div>
        </div>
        {hotspots.map((hotspot, index) => (
          <div className="hotspot-row" key={hotspot}>
            <span>{index + 1}</span>
            <strong>{hotspot}</strong>
            <i style={{ width: `${96 - index * 12}%` }} />
          </div>
        ))}
      </section>

      <section className="fleet-card simulation-card">
        <TrendingDown size={28} />
        <h3>Shifting 1-hour delivery window reduces fleet UV dose by 31%.</h3>
        <p>Mock simulation compares current dispatch peaks against a cooler 10:30 AM and 4:30 PM split window.</p>
      </section>
    </div>
  )
}
