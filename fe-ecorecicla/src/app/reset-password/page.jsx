'use client';
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useAutenticacion } from '@/context/ContextoAutenticacion';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const RestablecerPasswordForm = () => {
    const { restablecerPassword } = useAutenticacion();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [exito, setExito] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!token) {
            setError('Este enlace no es válido. Solicita uno nuevo.');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setCargando(true);
        const resultado = await restablecerPassword(token, password);

        if (resultado.exito) {
            setMensaje('Contraseña actualizada con éxito. Redirigiendo a iniciar sesión...');
            setExito(true);
            setTimeout(() => {
                router.push('/Login');
            }, 2000);
        } else {
            setError(resultado.mensaje || 'El enlace es inválido o ha expirado. Solicita uno nuevo.');
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('/fondo-login.jpg')] bg-cover bg-center flex items-center justify-center px-4">
            <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
                <Link href="/Home">
                    <img src="/Eco2.png" alt="Logo" className="w-48 h-full mb-6 cursor-pointer" />
                </Link>

                <h1 className="text-lg font-semibold text-gray-700 mb-6 text-center">
                    Restablecer contraseña
                </h1>

                {!token && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        Este enlace no incluye un token válido. Vuelve a solicitar el enlace de recuperación.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type={mostrarPassword ? "text" : "password"}
                            placeholder="Nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={exito}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5AF22] disabled:bg-gray-100"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                            tabIndex={-1}
                            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {mostrarPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={mostrarConfirmar ? "text" : "password"}
                            placeholder="Confirmar contraseña"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            required
                            disabled={exito}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5AF22] disabled:bg-gray-100"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                            tabIndex={-1}
                            aria-label={mostrarConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {mostrarConfirmar ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
                        </button>
                    </div>

                    <div className="w-full flex justify-center">
                        {mensaje && <p className="text-green-600 text-sm text-center">{mensaje}</p>}
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={cargando || exito || !token}
                        className={`w-full bg-[#A5AF22] text-white font-semibold py-3 rounded-md hover:bg-[#c4cd3f] transition flex items-center justify-center gap-2 ${(cargando || exito || !token) ? 'opacity-50 cursor-not-allowed hover:bg-[#A5AF22]' : ''}`}
                    >
                        {cargando && (
                            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {cargando ? 'Actualizando...' : 'Restablecer contraseña'}
                    </button>
                </form>

                <p className="mt-8 text-sm text-gray-600">
                    <Link href="/Login" className="text-[#A5AF22] font-semibold hover:underline">
                        Volver a iniciar sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

const RestablecerPassword = () => {
    return (
        <>
            <Suspense fallback={null}>
                <RestablecerPasswordForm />
            </Suspense>
            <Footer />
        </>
    );
};

export default RestablecerPassword;