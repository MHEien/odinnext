'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, AttributionControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

// Custom marker icon
const customIcon = L.icon({
  iconUrl: '/images/map-marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

interface MapProps {
  center: [number, number]
  zoom?: number
  className?: string
}

export default function Map({ center, zoom = 15, className = '' }: MapProps) {
  useEffect(() => {
    // Fix for the missing icon issue in production
    const iconPrototype = L.Icon.Default.prototype as { _getIconUrl?: string }
    delete iconPrototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/map-marker.svg',
      iconUrl: '/images/map-marker.svg',
      shadowUrl: '',
    })
  }, [])
  const t = useTranslations('Contact')

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`w-full h-full rounded-2xl ${className}`}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='<a href="https://www.openstreetmap.org/copyright" class="text-stone-400 hover:text-stone-300 text-xs opacity-75">© OpenStreetMap</a>'
      />
      <AttributionControl
        position="bottomright"
        prefix={false}
      />
      <Marker position={center} icon={customIcon}>
        <Popup className="text-stone-900">
          <div className="font-norse text-lg">Odin Chocolate</div>
          <div className="text-sm">Thorshaugveien 1, 3090 Hof, Norway</div>
            <Link href="https://www.google.com/maps/dir/?api=1&destination=Thorshaugveien%201,%203090%20Hof,%20Norway" className="text-amber-500 hover:text-amber-600 flex items-center gap-1">
            {t('visit_us')}
            <ExternalLink className="w-4 h-4" />
            </Link>

        </Popup>
      </Marker>
    </MapContainer>
  )
} 