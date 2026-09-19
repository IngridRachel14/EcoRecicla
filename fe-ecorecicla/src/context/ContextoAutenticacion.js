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
      const response = await fetch('http://67.205.137.87:3000/auth/login', {
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


    // Paso 1: el usuario pide el enlace de recuperación por correo
  const solicitarRecuperacion = async (email) => {
    try {
      const response = await fetch('http://67.205.137.87:3000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { exito: false, mensaje: data.message || data.error || 'No se pudo enviar el correo' };
      }

      return { exito: true, mensaje: data.message };
    } catch (error) {
      console.error('Error en solicitarRecuperacion:', error);
      return { exito: false, mensaje: 'Error de conexión con el servidor' };
    }
  };

  // Paso 2: el usuario define la nueva contraseña usando el token del enlace
  const restablecerPassword = async (token, password) => {
    try {
      const response = await fetch(`http://67.205.137.87:3000/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { exito: false, mensaje: data.message || data.error || 'El enlace es inválido o expiró' };
      }

      return { exito: true, mensaje: data.message };
    } catch (error) {
      console.error('Error en restablecerPassword:', error);
      return { exito: false, mensaje: 'Error de conexión con el servidor' };
    }
  };

  return (
    <ContextoAutenticacion.Provider value={{ token, iniciarSesion, cerrarSesion, solicitarRecuperacion, restablecerPassword }}>
      {children}
    </ContextoAutenticacion.Provider>
  );
};

export const useAutenticacion = () => useContext(ContextoAutenticacion);
