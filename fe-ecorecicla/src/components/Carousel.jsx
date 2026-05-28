'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

const HeroCarousel = () => {
    return (
        <div className="relative">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: '.custom-next',
                    prevEl: '.custom-prev',
                }}
                className="w-full h-[75vh]"
            >
                {/* Slide 1 */}
                <SwiperSlide>
                    <section className="w-full h-[80vh] flex flex-col justify-center bg-[url('/fondo-reciclaje.png')] bg-cover bg-center bg-no-repeat text-white px-6">
                        <div className="ml-10 max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">RECICLA PA' LA RACHA</h1>
                            <p className="text-lg lg:text-xl text-justify mb-8 drop-shadow-md">
                                Tus acciones cuentan. Al reciclar, cuidas el planeta, reduces residuos y construyes un futuro más limpio.
                            </p>
                            <a href="/ZonaEducativa" className="bg-white text-green-900 px-6 py-3 font-semibold rounded-md hover:bg-green-300 transition w-fit">
                                CONOCE MÁS
                            </a>
                        </div>
                    </section>
                </SwiperSlide>

                {/* Slide 2 */}
                <SwiperSlide>
                    <section className="w-full h-[80vh] flex flex-col justify-center bg-[url('/carousel-2.jpg')] bg-cover bg-center bg-no-repeat text-white px-6">
                        <div className="ml-10 max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">CUIDA EL BOSQUE</h1>
                            <p className="text-xl lg:text-xl text-justify mb-10 drop-shadow-md">
                                Proteger los recursos naturales es tarea de todos. ¡Haz la diferencia hoy!
                            </p>
                            <a href="/ZonaEducativa" className="bg-white text-green-900 px-6 py-3 font-semibold rounded-md hover:bg-green-300 transition w-fit">
                                APRENDE MÁS
                            </a>
                        </div>
                    </section>
                </SwiperSlide>

                {/* Slide 3 */}
                <SwiperSlide>
                    <section className="w-full h-[80vh] flex flex-col justify-center bg-[url('/carousel-3.png')] bg-cover bg-center bg-no-repeat text-white px-6">
                        <div className="ml-10 max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Campaña de Recolección de Plástico</h1>
                            <p className="text-xl lg:text-xl text-justify mb-10 drop-shadow-md">
                                ¡Únete a nosotros el <span className="font-semibold">jueves 15 de agosto</span> para hacer la diferencia! La Fundación
                                <span className="font-semibold"> EcoRecicla</span> organiza una jornada especial para recolectar plástico y cuidar nuestro planeta.
                            </p>
                            <a href='/Mapa' className="bg-white text-green-900 px-6 py-3 font-semibold rounded-md hover:bg-green-300 transition w-fit">
                                PARTICIPA
                            </a>
                        </div>
                    </section>
                </SwiperSlide>

                {/* Slide 4 */}
                <SwiperSlide>
                    <section className="w-full h-[80vh] flex flex-col justify-center bg-[url('/carousel-4.png')] bg-cover bg-center bg-no-repeat text-white px-6">
                        <div className="ml-10 max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">¿Sabías que reciclar plástico ayuda al planeta?</h1>
                            <p className="text-lg lg:text-xl text-justify mb-8 drop-shadow-md">
                                Reciclar una tonelada de plástico puede ahorrar hasta <span className="font-semibold">7.4 metros cúbicos de espacio en vertederos</span> y reducir la emisión de gases de efecto invernadero en <span className="font-semibold">hasta 1.5 toneladas de CO₂</span>. ¡Cada botella que reciclas cuenta para un planeta más limpio!
                            </p>
                            <a href="/ZonaEducativa" className="bg-white text-green-900 px-6 py-3 font-semibold rounded-md hover:bg-green-300 transition w-fit">
                                APRENDE MÁS
                            </a>
                        </div>
                    </section>
                </SwiperSlide>
            </Swiper>

            {/* Flechas personalizadas */}
            <div className="custom-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-50 cursor-pointer bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-50 transition">
                <ChevronLeftIcon className="h-6 w-6 text-white" />
            </div>
            <div className="custom-next absolute right-4 top-1/2 transform -translate-y-1/2 z-50 cursor-pointer bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition">
                <ChevronRightIcon className="h-6 w-6 text-white" />
            </div>
        </div>
    )
}

export default HeroCarousel
