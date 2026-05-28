"use client";
import React from "react";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
import { useRanking } from "@/context/RankingContext";

const RankingPage = () => {
  const { top10, currentUser, loading, error } = useRanking();

  if (loading)
    return <div className="text-center mt-10 text-green-700 font-medium text-base">Cargando ranking ecológico...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600 font-medium text-base">Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[url('/fondo-ranking.jpg')] bg-cover bg-center flex items-center justify-center px-5 py-16">
        <main className="max-w-2xl w-full">
          <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Barra título verde */}
            <div className="bg-green-700 px-6 py-4 flex items-center justify-center gap-3">
              <span role="img" aria-label="trofeo" className="text-yellow-400 text-2xl select-none">🏆</span>
              <h2 className="text-white text-3xl font-extrabold m-0">Ranking</h2>
              <span role="img" aria-label="hoja" className="text-white text-2xl select-none">🏆</span>
            </div>

            {/* Contenido blanco debajo */}
            <div className="p-6 sm:p-8">
              {currentUser && (
                <div className="mb-8 text-center flex justify-center items-center gap-3">
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white font-semibold text-xs"
                    title={`Tu posición: #${currentUser.rank}`}
                  >
                    #{currentUser.rank}
                  </span>
                  <div className="text-green-700 text-lg font-semibold truncate">{currentUser.name}</div>
                  <div className="text-gray-500 text-sm">{currentUser.totalPoints} puntos</div>
                </div>
              )}

              <div className="space-y-4">
                {top10.map((user, index) => {
                  let bgColor = "bg-gray-50 text-green-800";
                  let border = "";
                  let badge = null;
                  let ring = "";

                  if (index === 0) {
                    bgColor = "bg-yellow-50 text-yellow-900";
                    border = "border-2 border-yellow-400";
                    badge = "🥇";
                    ring = "ring-2 ring-yellow-300";
                  } else if (index === 1) {
                    bgColor = "bg-gray-100 text-gray-800";
                    border = "border-2 border-gray-400";
                    badge = "🥈";
                    ring = "ring-2 ring-gray-300";
                  } else if (index === 2) {
                    bgColor = "bg-orange-50 text-orange-900";
                    border = "border-2 border-orange-400";
                    badge = "🥉";
                    ring = "ring-2 ring-orange-300";
                  }

                  return (
                    <div
                      key={user.id}
                      className={`flex justify-between items-center px-8 py-3 rounded-xl shadow-md ${bgColor} ${border} ${ring}`}
                    >
                      <div className="flex items-center gap-6 w-2/3">
                        <span className="text-2xl">{badge || `#${index + 1}`}</span>
                        <span className="text-lg font-medium truncate">{user.name}</span>
                      </div>
                      <span className="text-lg font-bold w-1/3 text-right">{user.totalPoints} pts</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default RankingPage;
