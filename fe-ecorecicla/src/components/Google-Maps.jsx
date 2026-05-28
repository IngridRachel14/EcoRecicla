"use client"
import { Loader } from '@googlemaps/js-api-loader'
import React, { useEffect, useRef } from 'react'

function GoogleMaps({ markers }) {
    const mapRef = useRef(null)

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY, // Asegúrate de que la variable empiece con NEXT_PUBLIC
                version: "quarterly",
                libraries: ['places']
            })

            const { Map } = await loader.importLibrary("maps")

            // Ubicación general para centrar el mapa
            const location = {
                lat: 9.0260274,
                lng: -79.5306509
            }

            const options = {
                center: location,
                zoom: 15,
                mapId: "map",
                streetViewControl: false
            }

            const map = new Map(mapRef.current, options)

            const { AdvancedMarkerElement } = await loader.importLibrary('marker')

            markers.forEach(markerData => {
                new AdvancedMarkerElement({
                    position: {
                        lat: markerData.lat,
                        lng: markerData.lng
                    },
                    title: markerData.title,
                    map: map,
                })
            })
        }

        initMap()
    }, [markers])

    return (
        <div className='flex flex-row gap-4 p-5 justify-center'>
            <div className='flex justify-center items-center h-[500px] w-[500px]'>
                <div ref={mapRef} className='w-full h-full' />
            </div>

            <div className='max-w-sm flex flex-col justify-center ml-6'>
                <div className="grid gap-4">
                    <div className="bg-blue-100 border border-green-900 rounded-none p-4 shadow-xl">
                        <p className='text-2xl font-semibold text-center'>
                            🗑️Mapa de Maquinas Recicladoras🗑️ <br />
                        </p>
                    </div>

                    <a
                        href="https://maps.app.goo.gl/yZdmME9eFvE8H64o8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-green-100 border border-purple-900 rounded-lg p-4 shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                    >
                        <p className="text-green-900 font-semibold">
                            🌳 Universidad Tecnológica de Panamá 🌳<br />
                            (Campus Central)
                        </p>
                    </a>

                    <a
                        href="https://maps.app.goo.gl/9ba6xgfpX1ZL6K4q6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-green-100 border border-green-900 rounded-lg p-4 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                    >
                        <p className="text-green-900 font-semibold">🛒 SuperXtra (Condado Del Rey) ♻️</p>
                    </a>

                    <a
                        href="https://maps.app.goo.gl/tVhFPCHyd4Jt7Dg28"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-green-100 border border-blue-900 rounded-lg p-4 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                    >
                        <p className="text-green-800 font-semibold">🧴 RibaSmith (Altaplaza Mall) 🌿</p>
                    </a>

                    <a
                        href="https://maps.app.goo.gl/avjeqPAer8WsEbzw9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-green-100 border border-gray-900 rounded-lg p-4 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                    >
                        <p className="text-green-800 font-semibold">🍃 RibaSmith (Multiplaza) 🗑️</p>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default GoogleMaps
