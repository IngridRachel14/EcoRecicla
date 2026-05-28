'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAutenticacion } from '../../context/ContextoAutenticacion';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';


const Login = () => {
    const { iniciarSesion } = useAutenticacion();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        const success = await iniciarSesion(email, password);
        if (success) {
            router.push('/Home');
        } else {
            setError('Correo o contraseña incorrectos');
            setCargando(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-[url('/fondo-login.jpg')] bg-cover bg-center flex items-center justify-center px-4">
                <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
                    <Link href="/Home">
                        <img src="/Eco2.png" alt="Logo" className="w-48 h-full mb-6 cursor-pointer" />
                    </Link>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5AF22]"
                        />
                        <div className="relative">
                            <input
                                type={mostrarPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5AF22]"
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                tabIndex={-1}
                                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {mostrarPassword ? (
                                    <AiFillEyeInvisible size={24} />
                                ) : (
                                    <AiFillEye size={24} />
                                )}
                            </button>
                        </div>

                        <div className='w-full flex justify-center'>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className={`w-full bg-[#A5AF22] text-white font-semibold py-3 rounded-md hover:bg-[#c4cd3f] transition flex items-center justify-center gap-2
      ${cargando ? 'opacity-50 cursor-not-allowed hover:bg-[#A5AF22]' : ''}
    `}
                        >
                            {cargando && (
                                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>

                    </form>

                    <p className="mt-8 text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <Link href="/Registro" className="text-[#A5AF22] font-semibold hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
   );
};
export default Login;

