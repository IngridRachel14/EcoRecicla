"use client";
import React from "react";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
import { useRanking } from "@/context/RankingContext";

const Botella = ({ style = {} }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
    <path d="M9 3h6M10 3v2.5L7 9v10a2 2 0 002 2h6a2 2 0 002-2V9l-3-3.5V3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 13h10" strokeLinecap="round" />
  </svg>
);

const Corona = ({ style = {} }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={style}>
    <path d="M3 17l2-8 4 5 3-9 3 9 4-5 2 8H3z" strokeLinejoin="round" />
    <path d="M3 20h18" strokeLinecap="round" />
  </svg>
);

const medallas = {
  0: {
    gradiente: "linear-gradient(135deg, #f9d423 0%, #f5a200 30%, #ffe066 55%, #c97b00 80%, #f9d423 100%)",
    fondo: "bg-yellow-50", borde: "border-2 border-yellow-400", ring: "ring-2 ring-yellow-300",
    badge: "🥇", nombreClass: "nombre-oro", label: "ORO",
  },
  1: {
    gradiente: "linear-gradient(135deg, #e8edf2 0%, #a0b4c8 30%, #d8e4ee 55%, #7090aa 80%, #c8d8e8 100%)",
    fondo: "bg-gray-100", borde: "border-2 border-gray-400", ring: "ring-2 ring-gray-300",
    badge: "🥈", nombreClass: "nombre-plata", label: "PLATA",
  },
  2: {
    gradiente: "linear-gradient(135deg, #f0c090 0%, #c07840 30%, #e8a860 55%, #8a4e20 80%, #d89050 100%)",
    fondo: "bg-orange-50", borde: "border-2 border-orange-400", ring: "ring-2 ring-orange-300",
    badge: "🥉", nombreClass: "nombre-bronce", label: "BRONCE",
  },
};

const RankingPage = () => {
  const { top10, currentUser, loading, error } = useRanking();

  return (
    <>
      <style>{`
        @keyframes subirFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .entra { opacity: 0; animation: subirFadeIn 0.5s ease forwards; }

        @keyframes brilloMetal {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .nombre-oro {
          background: linear-gradient(90deg, #7a4f00 0%, #ffe066 35%, #f5a200 55%, #ffe066 75%, #7a4f00 100%);
          background-size: 200% auto; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
          animation: brilloMetal 2.8s linear infinite; font-weight: 700;
        }
        .nombre-plata {
          background: linear-gradient(90deg, #2a4a62 0%, #c8dce8 35%, #7090aa 55%, #c8dce8 75%, #2a4a62 100%);
          background-size: 200% auto; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
          animation: brilloMetal 3.2s linear infinite; font-weight: 700;
        }
        .nombre-bronce {
          background: linear-gradient(90deg, #5a2e08 0%, #e8a860 35%, #8a4e20 55%, #e8a860 75%, #5a2e08 100%);
          background-size: 200% auto; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
          animation: brilloMetal 3.5s linear infinite; font-weight: 700;
        }
        .badge-metal {
          display: inline-block; padding: 2px 10px; border-radius: 20px;
          font-size: 0.6rem; font-weight: 800; letter-spacing: 0.12em;
          color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .fila-medal { transition: background 0.18s, transform 0.18s; }
        .fila-medal:hover { transform: translateX(5px); }
        .fila-lista { transition: background 0.18s, transform 0.18s; cursor: default; }
        .fila-lista:hover { background: #e6f2da !important; transform: translateX(5px); }
        .sep { border-top: 1px solid #e4eedd; }
      `}</style>

      <Navbar />

      {/* Header */}
      <header style={{
        position: "relative", overflow: "hidden",
        paddingTop: "2rem",
        paddingBottom: "14rem",
        backgroundImage: "url('/ranking_fondo.png')",
        backgroundSize: "cover", backgroundPosition: "center top",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(8,30,4,0.12) 0%, rgba(8,30,4,0.22) 100%)",
        }} />
        <div className="entra" style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem", display: "flex", justifyContent: "center" }}>
          <Corona style={{ width: 56, height: 56, color: "#f5c400" }} />
        </div>
      </header>

      {/* Tabla */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 1rem 4rem", marginTop: "-4rem", position: "relative", zIndex: 10 }}>

        {loading && (
          <p className="entra" style={{ textAlign: "center", paddingTop: "4rem", color: "#4a7a30", fontWeight: 500 }}>
            Cargando ranking ecológico…
          </p>
        )}

        {error && (
          <p className="entra" style={{ textAlign: "center", paddingTop: "4rem", color: "#b03020" }}>
            Error: {error}
          </p>
        )}

        {!loading && !error && (
          <section className="entra bg-white rounded-2xl shadow-xl overflow-hidden" style={{ animationDelay: "0.05s" }}>

            {currentUser && (
              <div style={{
                padding: "0.9rem 1.5rem", display: "flex", alignItems: "center", gap: 14,
                background: "linear-gradient(135deg, #1e4d10, #3a7a22)",
              }}>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 20, background: "rgba(255,255,255,0.15)",
                  color: "#fff", letterSpacing: "0.05em", whiteSpace: "nowrap",
                }}>
                  #{currentUser.rank}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.88rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentUser.name}
                  </p>
                  <p style={{ color: "rgba(168,216,122,0.75)", fontSize: "0.65rem", margin: 0 }}>Tu posición actual</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Botella style={{ width: 13, height: 13, color: "#a8d87a" }} />
                  <span style={{ color: "#a8d87a", fontWeight: 700, fontSize: "0.9rem" }}>{currentUser.totalPoints}</span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem" }}>pts</span>
                </div>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", padding: "0.6rem 1.5rem", background: "#f4faee" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#7aaa5a", letterSpacing: "0.12em", width: 40 }}>#</span>
              <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#7aaa5a", letterSpacing: "0.12em", flex: 1 }}>RECICLADOR</span>
              <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#7aaa5a", letterSpacing: "0.12em" }}>PUNTOS</span>
            </div>

            {top10.map((user, index) => {
              const m = medallas[index];

              if (m) {
                return (
                  <div
                    key={user.id}
                    className={`fila-medal entra sep flex items-center gap-3 px-6 py-3 ${m.fondo} ${m.borde} ${m.ring}`}
                    style={{ animationDelay: `${(index + 2) * 60}ms`, borderLeft: "none", borderRight: "none", borderRadius: 0 }}
                  >
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#aac898", width: 40, textAlign: "center", flexShrink: 0 }}>
                      {m.badge}
                    </span>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                      background: m.gradiente,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.78rem", fontWeight: 700, color: "#fff",
                      textShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    }}>
                      {user.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                      <span className={m.nombreClass}>{user.name}</span>
                      <span className="badge-metal self-start mt-0.5" style={{ background: m.gradiente }}>
                        {m.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                      <Botella style={{ width: 13, height: 13, color: "#5a9a3c" }} />
                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2d5a1b" }}>{user.totalPoints}</span>
                      <span style={{ fontSize: "0.65rem", color: "#8aab6a" }}>pts</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={user.id}
                  className="fila-lista sep entra"
                  style={{
                    display: "flex", alignItems: "center",
                    padding: "0.8rem 1.5rem", gap: 12, background: "#fff",
                    animationDelay: `${(index + 2) * 60}ms`,
                  }}
                >
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#aac898", width: 40, textAlign: "center", flexShrink: 0 }}>
                    {index + 1}
                  </span>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: "#eaf3e0", border: "1.5px solid #c4deb0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.78rem", fontWeight: 700, color: "#3a6b20",
                  }}>
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: 500, color: "#1a3014", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <Botella style={{ width: 13, height: 13, color: "#5a9a3c" }} />
                    <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2d5a1b" }}>{user.totalPoints}</span>
                    <span style={{ fontSize: "0.65rem", color: "#8aab6a" }}>pts</span>
                  </div>
                </div>
              );
            })}

            <p style={{ textAlign: "center", padding: "1rem", fontSize: "0.68rem", color: "#8aab6a", letterSpacing: "0.05em", borderTop: "1px solid #e4eedd" }}>
              Actualizado en tiempo real · cada botella reciclada cuenta
            </p>

          </section>
        )}
      </div>

      <Footer />
    </>
  );
};

export default RankingPage;
