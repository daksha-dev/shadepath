import { cityActions, safestCorridors, worstCorridors } from '../data/mockHeatmap'

export function CityRiskPanel() {
  return (
    <div className="panel col-span-4">
      <div>
        <p className="label">Institutional view</p>
        <h2>City UV risk corridors</h2>
      </div>
      
      <div className="data-list danger">
        <p className="label" style={{ color: 'var(--signal)' }}>Worst UV Corridors</p>
        {worstCorridors.map((item, i) => (
          <div className="data-list-item" key={item}>
            <span className="rank tabular">{i + 1}</span>
            <span className="name">{item}</span>
          </div>
        ))}
      </div>
      
      <div className="data-list safe">
        <p className="label" style={{ color: 'var(--moss)' }}>Safest Shade Corridors</p>
        {safestCorridors.map((item, i) => (
          <div className="data-list-item" key={item}>
            <span className="rank tabular">{i + 1}</span>
            <span className="name">{item}</span>
          </div>
        ))}
      </div>
      
      <div className="data-list action">
        <p className="label">Recommended action</p>
        {cityActions.map((item) => (
          <div className="data-list-item" key={item}>
            <span className="name">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
