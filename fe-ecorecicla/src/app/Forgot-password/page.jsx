'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useAutenticacion } from '@/context/ContextoAutenticacion';

const OlvidoPassword = () => {
    const { solicitarRecuperacion } = useAutenticacion();
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        setCargando(true);

        const resultado = await solicitarRecuperacion(email);

        if (resultado.exito) {
            setMensaje('Te enviamos un enlace para restablecer tu contraseña. Revisa tu correo (incluyendo spam).');
            setEnviado(true);
        } else {
            setError(resultado.mensaje || 'Ocurrió un error. Intenta de nuevo.');
        }
        setCargando(false);
    };

    return (
        <>
            <div className="min-h-screen bg-[url('/fondo-login.jpg')] bg-cover bg-center flex items-center justify-center px-4">
                <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
                    <Link href="/Home">
                        <img src="/Eco2.png" alt="Logo" className="w-48 h-full mb-6 cursor-pointer" />
                    </Link>

                    <h1 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                        ¿Olvidaste tu contraseña?
                    </h1>
                    <p className="text-sm text-gray-500 mb-6 text-center">
                        Ingresa tu correo y te enviaremos un enlace para restablecerla.
                    </p>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={enviado}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5AF22] disabled:bg-gray-100"
                        />

                        <div className="w-full flex justify-center">
                            {mensaje && <p className="text-green-600 text-sm text-center">{mensaje}</p>}
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={cargando || enviado}
                            className={`w-full bg-[#A5AF22] text-white font-semibold py-3 rounded-md hover:bg-[#c4cd3f] transition flex items-center justify-center gap-2 ${(cargando || enviado) ? 'opacity-50 cursor-not-allowed hover:bg-[#A5AF22]' : ''}`}
                        >
                            {cargando && (
                                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {cargando ? 'Enviando...' : enviado ? 'Enlace enviado' : 'Enviar enlace'}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-gray-600">
                        <Link href="/Login" className="text-[#A5AF22] font-semibold hover:underline">
                            Volver a iniciar sesión
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OlvidoPassword;