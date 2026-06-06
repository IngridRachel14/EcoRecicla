"use client";
import { useState } from "react";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";

const facts = [

  {
    icon: "♻️",
    title: "El largo camino de una botella de plástico",
    summary: "Puede tardar hasta 500 años en descomponerse si no se recicla correctamente.",
    detail: "Además, muchas de estas botellas terminan en los océanos, afectando la vida marina y contaminando los ecosistemas. Usar botellas reutilizables ayuda mucho a reducir este impacto ambiental."
  },

  {
    icon: "🌱",
    title: "Un pequeño gesto, un gran impacto",
    summary: "Salva 17 árboles, 26.000 litros de agua y reduce la contaminación del aire en un 74%.",
    detail: "El papel reciclado también ahorra un 60% de energía respecto al papel nuevo, lo que disminuye emisiones de CO₂ y protege hábitats naturales de la deforestación."
  },

  {
    icon: "⚡",
    title: "Una lata, múltiples vidas",
    summary: "Ahorra suficiente energía para alimentar una televisión durante 3 horas.",
    detail: "Además, el aluminio reciclado mantiene su calidad original, permitiendo ser reutilizado infinitamente en latas, bicicletas, herramientas y más."
  },

]



const videos = [
  { src: "https://www.youtube.com/embed/d84Sbs5IVzc?si=4OmsQ2NBS75RH-sk", title: "¿Cómo reciclar?" },
  { src: "https://www.youtube.com/embed/cCOfCFzQvCc?si=LmwYn4f_W6pfXHuK", title: "Reciclaje de plástico" },
]



export default function ZonaEducativa() {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Zona educativa</h1>
          <p className="text-l text-gray-500 mt-2">
            Aprende sobre el impacto del reciclaje y cómo pequeñas acciones pueden cambiar nuestro planeta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Videos */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Videos</p>
            {videos.map((v, i) => (
              <div key={i} className="flex flex-col gap-2">
                <p className="text-xl font-bold text-[#0F5F46]">
                  {v.title}
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={v.src}
                    title={v.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

                </div>
              </div>
            ))}
          </div>



          {/* Datos curiosos — misma altura que los videos */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Datos curiosos</p>
            <div className="flex flex-col gap-4 flex-1">
              {facts.map((fact, i) => (
                <div
                  key={i}
                  className="flex-1 bg-white border border-gray-200 rounded-xl p-5 hover:border-[#0d542b] transition-colors flex flex-col justify-between"
                >

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{fact.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{fact.title}</p>
                        <p className="text-sm text-gray-500">{fact.summary}</p>
                        {expanded === i && (
                          <p className="text-sm text-gray-500 mt-2">{fact.detail}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0d542b] hover:text-[#0d542b] transition-colors text-sm"
                    >
                      {expanded === i ? '−' : '+'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}