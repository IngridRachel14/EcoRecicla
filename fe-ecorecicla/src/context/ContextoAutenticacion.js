'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ContextoAutenticacion = createContext();

export const ProveedorAutenticacion = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenAlmacenado = localStorage.getItem('token');
    if (tokenAlmacenado) {
      setToken(tokenAlmacenado);
    }
  }, []);

  const iniciarSesion = async (email, password) => {
    try {
      const response = await fetch('http://67.205.137.87:3000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);

      return true;
    } catch (error) {
      console.error('Error en iniciarSesion:', error);
      return false;
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <ContextoAutenticacion.Provider value={{ token, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoAutenticacion.Provider>
  );
};

export const useAutenticacion = () => useContext(ContextoAutenticacion);
