"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAutenticacion } from "@/context/ContextoAutenticacion";

const RankingContext = createContext();

export const useRanking = () => useContext(RankingContext);

export const RankingProvider = ({ children }) => {
  const { token } = useAutenticacion();

  const [top10, setTop10] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRanking = async (jwt) => {
    if (!jwt) {
      setError("No JWT token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://67.205.137.87:3000/ranking", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setTop10(data.top10);
      setCurrentUser(data.currentUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar el fetch cuando cambia el token
  useEffect(() => {
    if (token) {
      setLoading(true);
      setError(null);
      fetchRanking(token);
    }
  }, [token]);

  return (
    <RankingContext.Provider
      value={{ top10, currentUser, loading, error}}
    >
      {children}
    </RankingContext.Provider>
  );
};
