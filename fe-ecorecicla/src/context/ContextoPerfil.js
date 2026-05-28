// context/usePerfil.js
import { useEffect, useState } from "react";
import authFetch from "@/app/utils/authFetch";
import { useAutenticacion } from "./ContextoAutenticacion";

export function usePerfil() {
  const { token } = useAutenticacion();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rankingPosicion, setRankingPosicion] = useState(null);
  const [puntos, setPuntos] = useState(0);
  const [botellas, setBotellas] = useState(0);
  const [historial, setHistorial] = useState(null);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      if (!token) return;

      try {
        // 1. Perfil
        const resPerfil = await authFetch("/profile", token);
        const perfilData = await resPerfil.json();
        if (resPerfil.ok) {
          setProfile(perfilData);
          setPuntos(perfilData.user.totalPoints || 0); // ← puntos desde perfil
          console.log("Datos de Perfil", perfilData)
        }

        // 2. Ranking
        const resRanking = await authFetch("/ranking", token);
        const ranking = await resRanking.json();
        if (resRanking.ok && ranking.currentUser) {
          setRankingPosicion(ranking.currentUser.rank);
        }

        // 3. Historial
        const resHistorial = await authFetch("/scan/history", token);
        const historialData = await resHistorial.json();
        if (resHistorial.ok && Array.isArray(historialData.transactions)) {
          setBotellas(historialData.transactions.length);
          setHistorial(historialData);
        }
      } catch (err) {
        console.error("❌ Error al cargar los datos:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setShowCards(true), 100);
      }
    };

    fetchDatos();
  }, [token]);

  return {
    profile,
    loading,
    rankingPosicion,
    puntos,
    botellas,
    historial,
    showCards,
  };
}
