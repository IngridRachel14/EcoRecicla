'use client';
import { useState } from 'react';

export default function Footer() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModal2, setMostrarModal2] = useState(false);
    const [mostrarModalIngrid, setMostrarModalIngrid] = useState(false);
    const [mostrarModalLuis, setMostrarModalLuis] = useState(false);
    const integrantes = [
        {
            nombre: 'Ingrid Quintanar',
            imagen: '/Ingrid.jpg',
            rol: 'Desarrolladora de Software & Analista de Sistemas',
            descripcion: 'Responsable del diseño y desarrollo del frontend, gestión de la base de datos y análisis de requerimientos del sistema.',
            contacto: 'ingrid.quintanar@utp.ac.pa',
            mostrar: mostrarModalIngrid,
            setMostrar: setMostrarModalIngrid,
        },
        {
            nombre: 'Luis Calderón',
            imagen: '/Luis.jpg',
            rol: 'Desarrollador de Software & Líder Técnico',
            descripcion: 'Responsable del desarrollo del módulo de inteligencia artificial, integración del backend y coordinación técnica del proyecto.',
            contacto: 'luis.calderon1@utp.ac.pa',
            mostrar: mostrarModalLuis,
            setMostrar: setMostrarModalLuis,
        },
       
    ];


    return (
        <main>
            <footer className="bg-white dark:bg-gray-900">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <a href="/" className="flex items-center">
                                <img src="/Eco2.png" className="h-20 me-3" alt="Ecorecicla Logo" />
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Sobre Nosotros</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    {integrantes.map((persona) => (
                                        <li key={persona.nombre} className="mb-4">
                                            <button
                                                onClick={() => persona.setMostrar(true)}
                                                className="hover:underline"
                                            >
                                                {persona.nombre}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Síguenos</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="https://github.com/ecorecicla" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            GitHub - Ecorecicla
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="https://twitter.com/ecorecicla" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            Twitter - @ecorecicla
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://instagram.com/ecorecicla" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            Instagram - @ecorecicla
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setMostrarModal2(true)}
                                            className="hover:underline"
                                        >
                                            Políticas de Privacidad
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => setMostrarModal(true)}
                                            className="hover:underline"
                                        >
                                            Términos & Condiciones
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                            ©2025 <a href="/" className="hover:underline">Ecorecicla™</a>. Todos los derechos reservados.
                        </span>
                    </div>
                </div>

                {integrantes.map((persona) =>
                    persona.mostrar && (
                        <div
                            key={persona.nombre}
                            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        >
                            <div className="bg-white p-6 rounded-2xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                                {/* Imagen más grande */}
                                <div className="flex justify-center">
                                    <img
                                        src={persona.imagen}
                                        alt={persona.nombre}
                                        className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover mb-6 border-4 border-[#A5AF22]"
                                    />
                                </div>

                                {/* Nombre y rol */}
                                <h2 className="text-2xl font-bold text-center mb-1">{persona.nombre}</h2>
                                <p className="text-center text-base text-[#A5AF22] font-semibold mb-4">{persona.rol}</p>

                                {/* Descripción */}
                                <p className="text-gray-700 text-base text-center mx-6 mb-4 px-4">{persona.descripcion}</p>

                                {/* Contacto */}
                                <p className="text-center text-md text-[#A5AF22] font-semibold">Contactar:</p>
                                <p className="text-gray-700 text-md text-center mb-4">{persona.contacto}</p>

                                {/* Botón de cierre */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => persona.setMostrar(false)}
                                        className="bg-[#A5AF22] text-white px-6 py-2 rounded-lg text-base hover:bg-[#c4cd3f] transition duration-300"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                )}

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

                {/* Modal de Políticas de Privacidad */}
                {mostrarModal2 && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-xl w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto shadow-xl relative">
                            <h2 className="text-xl font-bold mb-4 text-[#A5AF22]">Política de Privacidad</h2>
                            <p className="text-xs text-gray-500 mb-4">Última actualización: 2025</p>
                            <div className="text-sm text-gray-700 space-y-4">
                                <div>
                                    <h3 className="font-semibold">1. Responsable del Tratamiento de Datos</h3>
                                    <p>
                                        EcoRecicla <br />
                                        📍 Universidad Tecnológica de Panamá, Edificio 3, Salón 3-316 <br />
                                        📧 luis.calderon1@utp.ac.pa
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">2. Datos Personales que Recopilamos</h3>
                                    <p>
                                        Durante el uso de nuestros servicios, recopilamos únicamente los siguientes datos personales:
                                        <li>Nombre completo</li>
                                        <li>Número de cédula de identidad personal</li>
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">3. Finalidad del Tratamiento</h3>
                                    <p>
                                        Los datos personales serán utilizados exclusivamente para:

                                        <li>Registrar y administrar su cuenta de usuario</li>
                                        <li>Verificar la identidad del usuario para la asignación de puntos por reciclaje</li>
                                        <li>Gestionar el historial de reciclaje y los canjes realizados</li>
                                        <li>Garantizar el control y transparencia del sistema de recompensas</li>
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">4. Consentimiento</h3>
                                    <p>
                                        Al registrarse y utilizar la plataforma, usted otorga su consentimiento libre, informado y específico para el tratamiento de sus datos personales conforme a esta política.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">5. Almacenamiento y Seguridad de los Datos</h3>
                                    <p>
                                        Los datos recopilados se almacenan de forma segura y están protegidos mediante medidas técnicas y organizativas adecuadas para prevenir accesos no autorizados, pérdida o uso indebido de la información.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">6. Conservación de Datos</h3>
                                    <p>
                                        Los datos serán conservados mientras usted mantenga una cuenta activa en el sistema. En caso de cierre de cuenta, los datos serán eliminados de forma segura o anonimizados, conforme a lo dispuesto en la legislación vigente.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">7. Protección de Datos Personales</h3>
                                    <p>
                                        Usted tiene derecho a:
                                        <li> Acceder a sus datos personales</li>
                                        <li>Solicitar la corrección de datos erróneos</li>
                                        <li> Solicitar la eliminación de sus datos personales</li>
                                        <li>Revocar su consentimiento en cualquier momento</li>
                                        <li>Presentar reclamos ante la Autoridad Nacional de Transparencia y Acceso a la Información (ANTAI)</li>

                                        Para ejercer cualquiera de estos derechos, puede contactarnos a través del correo electrónico: luis.calderon1@utp.ac.pa.

                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">8. Divulgación a Terceros</h3>
                                    <p>
                                        EcoRecicla no comparte, vende ni alquila sus datos personales a terceros. Solo podrán ser divulgados si una autoridad judicial o administrativa debidamente competente lo solicita conforme a la ley.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">9. Cookies y Tecnologías Similares</h3>
                                    <p>
                                        Nuestra plataforma no utiliza cookies ni tecnologías de rastreo, dado que no recopilamos datos de navegación.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">10. Cambios a esta Política</h3>
                                    <p>
                                        Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Cualquier cambio será notificado a través de nuestra plataforma. El uso continuado del servicio implica su aceptación de la versión vigente.
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
                                        Para cualquier consulta relacionada con el tratamiento de sus datos personales, puede contactarnos a través de: <br />
                                        📧 luis.calderon1@utp.ac.pa<br />
                                        📍 Universidad Tecnológica de Panamá, Edificio 3, Salón 3-316
                                    </p>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => setMostrarModal2(false)}
                                        className="bg-[#A5AF22] text-white px-4 py-2 rounded-md hover:bg-[#c4cd3f]"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </footer>
        </main>
    );
}