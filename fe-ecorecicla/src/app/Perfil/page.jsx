"use client";

import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
import { usePerfil } from "@/context/ContextoPerfil";
import Link from "next/link";
import { useState } from "react";

export default function PerfilPage() {
  const {
    profile,
    loading,
    rankingPosicion,
    puntos,
    botellas,
    historial,
    showCards,
  } = usePerfil();

  const user = profile?.user;
  const [pagina, setPagina] = useState(0);
  const itemsPorPagina = 1;
  const transacciones = historial?.transactions || [];
  const actividadesPaginadas = transacciones.slice(
    pagina * itemsPorPagina,
    pagina * itemsPorPagina + itemsPorPagina
  );
  const totalPaginas = Math.ceil(transacciones.length / itemsPorPagina);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Banner con avatar */}
      <section className="relative h-70 bg-[url('/forest.jpg')] bg-cover bg-center shadow-lg">
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2">
          <div
            className={`relative group transition-transform duration-500 ease-out transform ${showCards ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
          >
            <img
              src={user?.picture?.url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              alt="avatar"
              className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Nombre y correo */}
      <section className="pt-6 text-center mb-4">
        {loading ? (
          <h2 className="text-lg font-semibold text-gray-700">Cargando...</h2>
        ) : (
          <div
            className={`transition-transform duration-500 ease-out transform ${showCards ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
          >
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.name || "Nombre no disponible"}
            </h2>
            <p className="text-gray-600 text-sm">{user?.email || ""}</p>
          </div>
        )}
      </section>

      {/* Contenido principal */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Actividad Reciente */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">
            Actividad Reciente
          </h2>

          <div className="flex flex-col gap-6">
            {actividadesPaginadas.length > 0 ? (
              actividadesPaginadas.map((tx) => (
                <div
                  key={tx.id}
                  className={`
                    rounded-3xl bg-white 
                    shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.25)] 
                    overflow-hidden transition-transform duration-500 ease-out transform 
                    hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] 
                    hover:-translate-y-2 w-full 
                    ${showCards ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                  `}
                >
                  <div className="bg-lime-900 p-5 text-center rounded-t-3xl">
                    <h3 className="text-lg font-semibold text-white">
                      Transacción #{tx.id}
                    </h3>
                  </div>
                  <div className="bg-white p-6 text-emerald-900 rounded-b-3xl">
                    <p className="mb-2 font-medium">
                      Fecha: {new Date(tx.createdAt).toLocaleString()}
                    </p>
                    <p className="mb-4 font-semibold text-green-600">
                      Puntos obtenidos: {tx.totalPoints}
                    </p>
                    <div className="flex gap-3 overflow-x-auto">
                      {tx.items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden border-2 ${item.valid
                            ? "border-green-500"
                            : "border-red-500 opacity-60"
                            }`}
                        >
                          <img
                            src={item.url}
                            alt={`Item ${item.id}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No hay actividad reciente.
              </p>
            )}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPagina((p) => Math.max(p - 1, 0))}
                disabled={pagina === 0}
                className={`px-4 py-2 rounded-md font-semibold ${pagina === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
              >
                Anterior
              </button>
              <span>
                Página {pagina + 1} de {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPagina((p) => Math.min(p + 1, totalPaginas - 1))
                }
                disabled={pagina === totalPaginas - 1}
                className={`px-4 py-2 rounded-md font-semibold ${pagina === totalPaginas - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Información Adicional
          </h2>

          {/* Monedero */}
          <div
            className={`
    rounded-3xl bg-white 
    shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.25)] 
    overflow-hidden transition-transform duration-500 ease-out transform 
    hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] 
    hover:-translate-y-3 hover:rotate-1 
    ${showCards ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
  `}
            style={{ width: "280px", height: "235px" }}
          >

            <div className="bg-lime-900 p-5 text-center rounded-t-3xl">
              <h3 className="text-lg font-semibold text-white">
                Monedero - EcoPoints
              </h3>
            </div>
            <div className="bg-white p-6 text-lime-900 rounded-b-3xl">
              <div className="text-5xl mb-4 text-center">
                <Link href="/Tienda">💵</Link>
              </div>
              <div className="flex justify-center gap-8 mt-3 text-center">
                <div>
                  <span className="block bg-lime-100 text-lime-900 font-semibold px-4 py-1 rounded-full">
                    Botellas
                  </span>
                  <span className="block mt-1 text-lg font-bold">
                    {botellas}
                  </span>
                </div>
                <div>
                  <span className="block bg-lime-100 text-lime-900 font-semibold px-4 py-1 rounded-full">
                    Puntos
                  </span>
                  <span className="block mt-1 text-lg font-bold">{puntos}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking */}
          <div
            className={`
    rounded-3xl bg-white 
    shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.25)] 
    overflow-hidden transition-transform duration-500 ease-out transform 
    hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] 
    hover:-translate-y-3 hover:rotate-1 
    ${showCards ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
  `}
            style={{ width: "280px", height: "200px" }}
          >
            <div className="bg-lime-900 p-5 text-center rounded-t-3xl">
              <h3 className="text-lg font-semibold text-white">
                Posición en el Ranking
              </h3>
            </div>
            <div className="bg-white p-6 text-emerald-900 rounded-b-3xl">
              <div className="text-5xl mb-3 text-center">
                <Link href="/Ranking">🏆</Link>
              </div>
              <p className="text-2xl font-bold text-center">
                {rankingPosicion !== null
                  ? `${rankingPosicion}. Lugar`
                  : "Sin ranking"}
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}