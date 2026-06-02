'use client';
import { createContext, useContext } from 'react';

const ContextoRegistro = createContext();

export const ProveedorRegistro = ({ children }) => {
  const registrarUsuario = async (nombre, email, password) => {
    try {
      const respuesta = await fetch('http://67.205.137.87:3000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nombre, email, password }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al registrar usuario');
      }

      const datos = await respuesta.json();
      return { exito: true, datos };
    } catch (error) {
      console.error('Registro fallido:', error);
      return { exito: false, error: error.message };
    }
  };

  return (
    <ContextoRegistro.Provider value={{ registrarUsuario }}>
      {children}
    </ContextoRegistro.Provider>
  );
};

export const useRegistro = () => useContext(ContextoRegistro);
