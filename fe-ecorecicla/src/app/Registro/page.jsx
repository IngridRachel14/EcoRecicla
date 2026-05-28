'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useRegistro } from '@/context/ContextoRegistro';
import { useRouter } from 'next/navigation';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Registro = () => {
    const { registrarUsuario } = useRegistro();
    const router = useRouter();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [aceptaTerminos, setAceptaTerminos] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        if (!aceptaTerminos) {
            setError('Debes aceptar los Términos y Condiciones para registrarte.');
            return;
        }

        const resultado = await registrarUsuario(nombre, email, password);

        if (resultado.exito) {
            setMensajeExito('Registrado con éxito');
            setNombre('');
            setEmail('');
            setPassword('');
            setAceptaTerminos(false);
            setCargando(true);
            setTimeout(() => {
                router.push('/Login');
            }, 2000);
        } else {
            setError('Error al registrarse. Intente nuevamente.');
        }
    };


    return (
        <>
            <div className="min-h-screen bg-[url('/registro-background.jpg')] bg-cover bg-center flex flex-col justify-center px-4">
                <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center mx-auto">
                    <Link href="/Home">
                        <img src="/Eco2.png" alt="Logo" className="w-48 h-full mb-6 cursor-pointer" />
                    </Link>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 relative">
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5AF22]"
                        />
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

                        {/* Checkbox de Términos y Condiciones */}
                        <div className="flex items-center gap-2 mt-4 ml-1">
                            <input
                                type="checkbox"
                                id="terminos"
                                checked={aceptaTerminos}
                                onChange={(e) => setAceptaTerminos(e.target.checked)}
                                className="w-4 h-4 text-[#A5AF22] focus:ring-[#A5AF22] border-gray-300 rounded"
                            />

                            <label htmlFor="terminos" className="text-sm text-gray-700">
                                He leído y acepto los{' '}
                                <button
                                    type="button"
                                    onClick={() => setMostrarModal(true)}
                                    className="text-[#A5AF22] font-semibold hover:underline"
                                >
                                    Términos & Condiciones
                                </button>
                            </label>
                        </div>

                        <div className="w-full flex justify-center">
                            {mensajeExito && <p className="text-green-600 text-sm text-center">{mensajeExito}</p>}
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className={`w-full bg-[#A5AF22] text-white font-semibold py-3 rounded-md hover:bg-[#c4cd3f] transition flex items-center justify-center gap-2 ${cargando ? 'opacity-50 cursor-not-allowed hover:bg-[#A5AF22]' : ''}`}
                        >
                            {cargando && (
                                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {cargando ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/Login" className="text-[#A5AF22] font-semibold hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>

            {/* Modal de Términos y Condiciones */}
            {mostrarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto shadow-xl relative">
                        <h2 className="text-xl font-bold mb-4 text-[#A5AF22]">Términos y Condiciones de Uso</h2>
                        <p className="text-xs text-gray-500 mb-4">Última actualización: 2025</p>
                        <div className="text-sm text-gray-700 space-y-4">
                            <div>
                                <h3 className="font-semibold">1. Información General</h3>
                                <p>
                                    Este sitio web es operado por EcoRecicla, con domicilio en Universidad Tecnológica de Panamá, Edificio 3, Salón 3-316. Esta plataforma permite a los usuarios registrar el reciclaje de botellas plásticas y recibir puntos que pueden canjear por productos virtuales o bonos de supermercado.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">2. Aceptación de los Términos</h3>
                                <p>
                                    Al acceder o usar nuestra plataforma, usted declara tener al menos 18 años de edad o contar con autorización de su representante legal, y acepta quedar legalmente vinculado por estos Términos y Condiciones, conforme a la legislación vigente de la República de Panamá, en especial la Ley 51 de 2008 sobre Comercio Electrónico, la Ley 81 de 2019 sobre Protección de Datos Personales, y la Ley 45 de 2007 sobre Protección al Consumidor.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">3. Registro y Cuenta de Usuario</h3>
                                <p>
                                    El usuario debe registrarse proporcionando datos verídicos y actualizados. Es responsable de mantener la confidencialidad de su cuenta y contraseña. La plataforma se reserva el derecho de suspender o eliminar cuentas que incumplan estos términos o presenten actividad fraudulenta.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">4. Sistema de Puntos</h3>
                                <p>
                                    Los puntos se obtienen exclusivamente a través del reciclaje validado de botellas plásticas en nuestras máquinas asociadas. Los puntos no son transferibles ni convertibles en dinero en efectivo. Tienen una vigencia de 12 meses desde la fecha de emisión y su uso está sujeto a las reglas establecidas en el sitio.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">5. Canje de Puntos</h3>
                                <p>
                                    Los puntos pueden canjearse por productos físicos, digitales o bonos de supermercado según disponibilidad. El envío está limitado a Panamá. No se aceptan devoluciones salvo productos defectuosos o errores, según la Ley 45 de 2007.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">6. Uso Aceptable</h3>
                                <p>
                                    El usuario se compromete a no usar la plataforma con fines ilegales, no manipular el sistema, ni utilizar software automatizado para acumular puntos.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">7. Protección de Datos Personales</h3>
                                <p>
                                    Los datos se tratarán conforme a la Ley 81 de 2019 y solo se usarán para operación del servicio. Puede ejercer sus derechos escribiendo a <strong>luis.calderon1@utp.ac.pa</strong>.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">8. Propiedad Intelectual</h3>
                                <p>
                                    Todo el contenido del sitio es propiedad de EcoRecicla y está protegido por leyes de propiedad intelectual.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">9. Limitación de Responsabilidad</h3>
                                <p>
                                    No somos responsables por daños indirectos, errores técnicos o fuerza mayor que afecten el servicio.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">10. Modificaciones</h3>
                                <p>
                                    Podemos modificar estos términos en cualquier momento. El uso continuo del servicio representa aceptación de los cambios.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">11. Jurisdicción y Ley Aplicable</h3>
                                <p>
                                    Estos términos se rigen por la ley panameña. Cualquier disputa será resuelta por los tribunales de la ciudad de Panamá.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">12. Contacto</h3>
                                <p>
                                    📧 luis.calderon1@utp.ac.pa<br />
                                    📍 Universidad Tecnológica de Panamá, Edificio 3, Salón 3-316
                                </p>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setMostrarModal(false)}
                                    className="bg-[#A5AF22] text-white px-4 py-2 rounded-md hover:bg-[#c4cd3f]"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default Registro;