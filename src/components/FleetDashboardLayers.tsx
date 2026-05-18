import { Marker, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import { hotspotsData } from './FleetDashboard'

type Props = {
  hoveredHotspot: string | null
}

const createIcon = (index: number, isHovered: boolean) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background-color: #1F4E79;
        color: white;
        border-radius: 50%;
        font-weight: 600;
        font-size: 12px;
        z-index: 10;
        box-shadow: 0 0 ${isHovered ? '20px' : '10px'} ${isHovered ? '8px' : '4px'} rgba(214, 54, 42, ${isHovered ? '0.6' : '0.3'});
        transform: ${isHovered ? 'scale(1.2)' : 'scale(1)'};
        transition: all 150ms ease-out;
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

export function FleetDashboardLayers({ hoveredHotspot }: Props) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([12.945, 77.65], 12, { duration: 0.25 })
  }, [map])

  return (
    <>
      {hotspotsData.map((hotspot, index) => {
        const isHovered = hoveredHotspot === hotspot.name
        return (
          <Marker
            key={hotspot.name}
            position={hotspot.coords as [number, number]}
            icon={createIcon(index, isHovered)}
          />
        )
      })}
    </>
  )
}
