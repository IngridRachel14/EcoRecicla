"use client";
import { useState } from "react";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ZonaEducativa() {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-7">
        <section className="mb-12">
          <h2 className="text-4xl font-semibold mb-6 text-green-700 ml-[2%]">
            Zona Educativa
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            {/* Sección de Video */}
            <div className="w-full">
              <h3 className="text-xl font-semibold mb-4 text-green-800">
                ¿Cómo Reciclar?
              </h3>
              <div className="aspect-video w-full max-w-md rounded-lg shadow-lg overflow-hidden mx-auto lg:mx-0">
                <iframe
                  width="500"
                  height="315"
                  src="https://www.youtube.com/embed/d84Sbs5IVzc?si=4OmsQ2NBS75RH-sk"
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4 text-green-800">
                Reciclaje de plástico 
              </h3>
              <div className="aspect-video w-full max-w-md rounded-lg shadow-lg overflow-hidden mx-auto lg:mx-0">
               <iframe width="560" height="315" src="https://www.youtube.com/embed/cCOfCFzQvCc?si=LmwYn4f_W6pfXHuK"
                title="YouTube video player" 
                
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                 referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen></iframe>
              </div>
            </div>

            {/* Sección de Datos Curiosos */}
            <div className="w-full">
              <h3 className="text-xl font-semibold mb-4 text-green-800">
                Datos Curiosos
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Card 1 */}
                <div
                  className={`relative bg-green-100 border border-green-300 rounded-lg p-5 shadow-md transition-all duration-1500 ${
                    expandedCard === 0 ? "h-auto" : "min-h-[180px]"
                  }`}
                >
                  <div className="text-green-600 text-3xl mb-2">♻️</div>
                  <h4 className="font-bold text-lg mb-2">
                    Una sola botella de plástico...
                  </h4>
                  <p>
                    ...puede tardar hasta 500 años en descomponerse si no se
                    recicla correctamente.
                  </p>
                  {expandedCard === 0 && (
                    <p className="mt-3 text-sm text-gray-700">
                      Además, muchas de estas botellas terminan en los océanos,
                      afectando la vida marina y contaminando los ecosistemas.
                      Usar botellas reutilizables ayuda mucho a reducir este
                      impacto ambiental.
                    </p>
                  )}
                  <button
                    onClick={() => toggleCard(0)}
                    className="absolute top-4 right-4 text-xl text-green-700 hover:text-green-900"
                  >
                    {expandedCard === 0 ? "✕" : "+"}
                  </button>
                </div>

                {/* Card 2 */}
                <div
                  className={`relative bg-lime-100 border border-lime-200 rounded-lg p-5 shadow-md transition-all duration-500 ${
                    expandedCard === 1 ? "h-auto" : "min-h-[180px]"
                  }`}
                >
                  <div className="text-lime-600 text-3xl mb-2">🌱</div>
                  <h4 className="font-bold text-lg mb-2">
                    Reciclar una tonelada de papel...
                  </h4>
                  <p>
                    ...salva 17 árboles, 26.000 litros de agua y reduce la
                    contaminación del aire en un 74%.
                  </p>
                  {expandedCard === 1 && (
                    <p className="mt-3 text-sm text-gray-700">
                      El papel reciclado también ahorra un 60% de energía
                      respecto al papel nuevo, lo que disminuye emisiones de CO₂
                      y protege hábitats naturales de la deforestación.
                    </p>
                  )}
                  <button
                    onClick={() => toggleCard(1)}
                    className="absolute top-4 right-4 text-xl text-lime-700 hover:text-lime-900 "
                  >
                    {expandedCard === 1 ? "✕" : "+"}
                  </button>
                </div>

                {/* Card 3 */}
                <div
                  className={`relative bg-orange-100 border border-orange-200 rounded-lg p-5 shadow-md transition-all duration-500 ${
                    expandedCard === 2 ? "h-auto" : "min-h-[180px]"
                  }`}
                >
                  <div className="text-emerald-600 text-3xl mb-2">⚡</div>
                  <h4 className="font-bold text-lg mb-2">
                    Reciclar una lata de aluminio...
                  </h4>
                  <p>
                    ...ahorra suficiente energía para alimentar una televisión
                    durante 3 horas.
                  </p>
                  {expandedCard === 2 && (
                    <p className="mt-3 text-sm text-gray-700">
                      Además, el aluminio reciclado mantiene su calidad
                      original, permitiendo ser reutilizado infinitamente en
                      latas, bicicletas, herramientas y más.
                    </p>
                  )}
                  <button
                    onClick={() => toggleCard(2)}
                    className="absolute top-4 right-4 text-xl text-emerald-700 hover:text-emerald-900"
                  >
                    {expandedCard === 2 ? "✕" : "+"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
       
      </main>
       <Footer/>
    </div>
  );
}
