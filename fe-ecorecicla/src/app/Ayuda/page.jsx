"use client";
import { useState, useEffect } from "react";
import categories from "./preguntasFrec";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";

// SVG Iconos
const icons = {
  cuenta: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  ),
  escaneo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="16" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="16" width="5" height="5" rx="1" />
      <path d="M16 16h5v5h-5z" opacity="0.3" />
      <path d="M13 3v4M3 13h4M13 13h2M17 13v2M13 17h4M17 19v2M19 13h2" strokeLinecap="round" />
    </svg>
  ),
  recompensas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M12 2l2.4 4.8 5.3.8-3.85 3.75.91 5.3L12 14.25 7.2 16.63l.91-5.3L4.26 7.58l5.3-.78L12 2z" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  ),
  general: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function Ayuda() {
  const [activeCategory, setActiveCategory] = useState("cuenta");
  const [openQuestion, setOpenQuestion] = useState(null);

  const activeFaqs = categories.find((c) => c.key === activeCategory)?.faqs || [];
  const activeLabel = categories.find((c) => c.key === activeCategory)?.title || "";

  useEffect(() => {
    setOpenQuestion(null);
  }, [activeCategory]);

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        .faq-item {
          border-bottom: 1px solid #e8f0e4;
          transition: background 0.2s;
        }
        .faq-item:last-child { border-bottom: none; }

        .cat-btn {
          transition: all 0.25s ease;
          border: 1.5px solid transparent;
        }
        .cat-btn:hover {
          background: #f0f7ed;
          border-color: #5a9a3c;
          color: #3a6b28;
        }
        .cat-btn.active {
          background: #f0f7ed;
          border-color: #5a9a3c;
          color: #3a6b28;
        }
        .cat-btn.active .cat-dot {
          background: #5a9a3c;
        }

        .answer-enter {
          animation: slideDown 0.25s ease forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chevron {
          transition: transform 0.25s ease;
        }
        .chevron.open {
          transform: rotate(180deg);
        }

        .hero-badge {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.3);
        }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/forest.jpg')", filter: "brightness(0.55)" }}
        />
        {/* subtle green tint overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(30,80,20,0.45) 0%, rgba(0,0,0,0.3) 100%)" }} />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6 gap-4">
          {/* small leaf icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="w-9 h-9 opacity-80 mb-1">
            <path d="M12 22C6 22 2 16 2 10c0 0 6-8 10-8s10 8 10 8c0 6-4 12-10 12z" />
            <path d="M12 22V10" strokeLinecap="round" />
          </svg>
          <h1 style={{fontFamily: "Roboto, sans-serif", fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            ¿En qué podemos ayudarte?
          </h1>
          <p className="text-white/75 text-medium max-w-sm leading-relaxed">
            Encuentra respuestas rápidas sobre tu cuenta, el reciclaje y tus recompensas.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-5 py-12" style={{ color: "#1a2e14" }}>

        {/* ── CATEGORY PILLS ── */}
        <style>{`
          .cat-label-short { display: none; }
          @media (max-width: 640px) {
            .cat-label-full { display: none; }
            .cat-label-short { display: inline; }
            .cat-btn { padding: 0.5rem 0.85rem; font-size: 0.72rem; gap: 0.4rem; }
          }
        `}</style>
        <nav className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => {
            const shortLabels = {
              cuenta: "Cuenta",
              escaneo: "Escaneo",
              recompensas: "Recompensas",
              general: "General",
            };
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`cat-btn flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium bg-white shadow-sm ${activeCategory === cat.key ? "active" : "text-[#4a5e40]"}`}
              >
                <span className={`w-2 h-2 rounded-full cat-dot transition-colors shrink-0 ${activeCategory === cat.key ? "bg-[#5a9a3c]" : "bg-[#c6dbb8]"}`} />
                <span className="shrink-0" style={{ color: activeCategory === cat.key ? "#3a6b28" : "#4a4a4a" }}>
                  {icons[cat.key]}
                </span>
                <span className="cat-label-full">{cat.title}</span>
                <span className="cat-label-short">{shortLabels[cat.key]}</span>
              </button>
            );
          })}
        </nav>

        {/* ── FAQ PANEL ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #e2edd9" }}>

          {/* panel header */}
          <div className="px-7 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid #e8f0e4", background: "#fafdf8" }}>
            <span style={{ color: "#5a9a3c" }}>{icons[activeCategory]}</span>
            <h2 className="font-semibold text-base" style={{ color: "#2a4a1e" }}>{activeLabel}</h2>
            <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#edf5e8", color: "#4a7a30" }}>
              {activeFaqs.length} preguntas
            </span>
          </div>

          {/* FAQ list */}
          {activeFaqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <button
                onClick={() => setOpenQuestion(openQuestion === idx ? null : idx)}
                className="w-full text-left px-7 py-5 flex items-start justify-between gap-4 hover:bg-[#fafdf8] transition-colors"
              >
                <span className="font-medium text-sm leading-relaxed" style={{ color: "#1e3318" }}>
                  {faq.question}
                </span>
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`w-4 h-4 shrink-0 mt-0.5 chevron ${openQuestion === idx ? "open" : ""}`}
                  style={{ color: "#5a9a3c" }}
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openQuestion === idx && (
                <div className="answer-enter px-7 pb-5">
                  {/* thin accent bar */}
                  <div className="flex gap-4">
                    <div className="w-0.5 rounded-full shrink-0 self-stretch" style={{ background: "#c6dbb8" }} />
                    <p className="text-sm leading-relaxed" style={{ color: "#4a5e40" }}>{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── CONTACT STRIP ── */}
        <div className="mt-8 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: "linear-gradient(135deg, #2d5a1b 0%, #3e7a28 100%)" }}>
          <div className="text-white">
            <p className="font-semibold text-sm">¿No encontraste lo que buscabas?</p>
            <p className="text-white/65 text-xs mt-0.5">Nuestro equipo te responde en menos de 24 horas.</p>
          </div>
          <a
            href="mailto:ecoreciclapa@gmail.com?subject=Consulta%20de%20soporte%20-%20EcoRecicla&body=Hola%20equipo%20de%20EcoRecicla%2C%0A%0AMe%20comunico%20porque%3A%0A%0A"
            className="shrink-0 text-sm font-medium rounded-full px-6 py-2.5 transition-all hover:opacity-90"
            style={{ background: "#a8d87a", color: "#1a3a0e" }}
          >
            Contactar soporte →
          </a>
        </div>

      </div>

      <Footer />
    </main>
  );
}
