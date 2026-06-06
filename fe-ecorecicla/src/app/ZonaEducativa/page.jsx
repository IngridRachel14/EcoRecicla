"use client";
import { useState } from "react";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";

const facts = [
  {
    title: "El largo camino de una botella de plástico",
    summary: "Puede tardar hasta 500 años en descomponerse si no se recicla correctamente.",
    detail: "Muchas de estas botellas terminan en los océanos, afectando la vida marina y contaminando ecosistemas. Usar botellas reutilizables reduce drásticamente este impacto ambiental.",
  },
  {
    title: "Un pequeño gesto, un gran impacto",
    summary: "Reciclar una tonelada de papel salva 17 árboles y 26.000 litros de agua.",
    detail: "El papel reciclado ahorra un 60% de energía respecto al papel nuevo, lo que disminuye emisiones de CO₂ y protege hábitats naturales de la deforestación.",
  },
  {
    title: "Una lata, múltiples vidas",
    summary: "Reciclar aluminio ahorra suficiente energía para alimentar una televisión durante 3 horas.",
    detail: "El aluminio reciclado mantiene su calidad original, permitiendo ser reutilizado infinitamente en latas, bicicletas, herramientas y más.",
  },
  {
    title: "El vidrio es eterno",
    summary: "El vidrio puede reciclarse indefinidamente sin perder pureza ni calidad.",
    detail: "A diferencia del plástico, el vidrio no libera toxinas al reciclarse. Una botella de vidrio reciclada ahorra suficiente energía para mantener encendida una bombilla durante 4 horas.",
  },
  {
    title: "Los residuos electrónicos también se reciclan",
    summary: "Una tonelada de teléfonos móviles puede contener más oro que una tonelada de mineral extraído de una mina.",
    detail: "Los aparatos electrónicos contienen materiales valiosos como oro, plata y cobre. Reciclarlos correctamente evita la contaminación por metales pesados y permite recuperar recursos para fabricar nuevos dispositivos.",
  },
  {
    title: "Una botella reciclada puede volver a nacer",
    summary: "Con aproximadamente 25 botellas de plástico recicladas se puede fabricar una chaqueta polar.",
    detail: "El plástico reciclado se transforma en fibras textiles utilizadas en ropa, mochilas y otros productos. Esto reduce la cantidad de residuos y disminuye la necesidad de producir plástico nuevo.",
  },
];

const videos = [
  { src: "https://www.youtube.com/embed/d84Sbs5IVzc?si=4OmsQ2NBS75RH-sk", title: "¿Cómo reciclar correctamente?" },
  { src: "https://www.youtube.com/embed/cCOfCFzQvCc?si=LmwYn4f_W6pfXHuK", title: "El ciclo del reciclaje de plástico" },
];

export default function ZonaEducativa() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div style={{
        backgroundImage: "url('/zona-educativa.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(10,40,10,0.45)",
        }} />
        <div style={{
          position: "relative", zIndex: 10,
          height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 2rem",
        }}>
          {/* icono */}
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1rem",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" style={{ width: 20, height: 20 }}>
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" strokeLinejoin="round" />
              <path d="M9 7h6M9 11h4" strokeLinecap="round" />
            </svg>
          </div>

          <h1 style={{ color: "#fff", fontSize: "2.4rem", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
            Zona educativa
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", margin: "0.75rem 0 0", maxWidth: 420, lineHeight: 1.6 }}>
            Aprende cómo pequeñas acciones pueden cambiar nuestro planeta.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── Videos ── */}
          <div className="flex flex-col gap-6">
            <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
              Videos
            </p>
            {videos.map((v, i) => (
              <div key={i} className="flex flex-col gap-2">
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "#0F5F46", margin: 0 }}>
                  {v.title}
                </p>
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", aspectRatio: "16/9" }}>
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

          {/* ── Datos curiosos ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
              Datos curiosos
            </p>
            {/* flex-1 en cada card + justifyContent stretch para que llenen el alto igual que los videos */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {facts.map((fact, i) => {
                const open = expanded === i;
                return (
                  <div
                    key={i}
                    style={{
                      border: `1px solid ${open ? "#0F5F46" : "#e5e7eb"}`,
                      borderRadius: 12,
                      padding: "1.1rem 1.25rem",
                      background: open ? "#f4fbf7" : "#fff",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <span style={{
                        flexShrink: 0,
                        width: 26, height: 26, borderRadius: "50%",
                        background: open ? "#0F5F46" : "#f3f4f6",
                        color: open ? "#fff" : "#6b7280",
                        fontSize: "0.72rem", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.2s, color 0.2s",
                        marginTop: 1,
                      }}>
                        {i + 1}
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>
                          {fact.title}
                        </p>
                        <p style={{ margin: "0.3rem 0 0", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.5 }}>
                          {fact.summary}
                        </p>
                        {open && (
                          <p style={{ margin: "0.6rem 0 0", fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.6, borderTop: "1px solid #d1fae5", paddingTop: "0.6rem" }}>
                            {fact.detail}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => setExpanded(open ? null : i)}
                        style={{
                          flexShrink: 0,
                          width: 28, height: 28, borderRadius: "50%",
                          border: `1px solid ${open ? "#0F5F46" : "#e5e7eb"}`,
                          background: "transparent",
                          color: open ? "#0F5F46" : "#9ca3af",
                          fontSize: "1rem", fontWeight: 400,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer",
                          transition: "border-color 0.2s, color 0.2s",
                          lineHeight: 1,
                        }}
                      >
                        {open ? "−" : "+"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
