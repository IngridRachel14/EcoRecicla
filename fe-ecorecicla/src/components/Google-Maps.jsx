"use client"
import { Loader } from '@googlemaps/js-api-loader'
import React, { useEffect, useRef } from 'react'

const locations = [
    { lat: 9.023625, lng: -79.532531, title: 'UTP Campus Central', sub: 'Edificio de Facilidades', url: 'https://maps.app.goo.gl/yZdmME9eFvE8H64o8' },
    { lat: 9.030088055527521, lng: -79.53407710985618, title: 'SuperXtra', sub: 'Condado del Rey', url: 'https://maps.app.goo.gl/9ba6xgfpX1ZL6K4q6' },
    { lat: 9.02645631752063, lng: -79.52183121536882, title: 'RibaSmith', sub: 'Altaplaza Mall', url: 'https://maps.app.goo.gl/tVhFPCHyd4Jt7Dg28' },
    { lat: 8.985965293372997, lng: -79.5101916582123, title: 'RibaSmith', sub: 'Multiplaza', url: 'https://maps.app.goo.gl/avjeqPAer8WsEbzw9' },
]

function GoogleMaps({ markers }) {
    const mapRef = useRef(null)

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
                version: "quarterly",
                libraries: ['places']
            })
            const { Map } = await loader.importLibrary("maps")
            const map = new Map(mapRef.current, {
                center: { lat: 9.0260274, lng: -79.5306509 },
                zoom: 13,
                mapId: "map",
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            })
            const { AdvancedMarkerElement } = await loader.importLibrary('marker')
            markers.forEach(m => new AdvancedMarkerElement({
                position: { lat: m.lat, lng: m.lng },
                title: m.title,
                map
            }))
        }
        initMap()
    }, [markers])

    return (
        <div className="px-6 py-10 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Máquinas recicladoras
                </h1>
    
                <p className="text-medium text-gray-500 mt-2">
                    Encuentra el punto de reciclaje más cercano a tiCada botella cuenta. Encuentra una máquina recicladora cerca de ti y marca la diferencia.
                </p>
    
                <div className="flex justify-center mt-4">
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                        4 máquinas activas
                    </span>
                </div>
            </div>
    
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="rounded-xl overflow-hidden border border-gray-200 h-[460px]">
                    <div ref={mapRef} className="w-full h-full" />
                </div>
    
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                        Ubicaciones
                    </p>
    
                    {locations.map((loc, i) => (
                        <a
                            key={i}
                            href={loc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-[#0d542b] transition-colors no-underline"
                        >
                            <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    style={{ color: '#0d542b' }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                    />
                                    <circle
                                        cx="12"
                                        cy="9"
                                        r="2.5"
                                        fill="none"
                                        strokeWidth={1.5}
                                    />
                                </svg>
                            </div>
    
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate m-0">
                                    {loc.title}
                                </p>
                                <p className="text-xs text-gray-500 m-0">
                                    {loc.sub}
                                </p>
                            </div>
    
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-gray-400 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GoogleMaps