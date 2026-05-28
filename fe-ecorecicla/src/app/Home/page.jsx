import React from 'react'
import Navbar from '@/components/Nav'
import Footer from '@/components/Footer'
import Carousel from '@/components/Carousel' // nuevo

const HomePage = () => {
  return (
    <main className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Carousel />

      <section className="py-10 px-4 bg-white text-center">
        <h2 className="text-4xl font-extrabold mb-12">¿Por qué Reciclar con Nosotros?</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Tarjeta 1 */}
          <div className="bg-[#f5eee4] p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            <div className="w-64 h-56 mx-auto mb-4 rounded-lg bg-[url('/reciclas-y-ganas.jpg')] bg-cover bg-center"></div>
            <h3 className="text-[#A5AF22] font-bold text-xl mb-2">¡Reciclas y ganas!</h3>
            <p className="text-gray-700 text-base">Cada botella plástica que depositas en nuestras máquinas se convierte en puntos. ¡Es tu recompensa por cuidar el planeta!</p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-[#f5eee4] p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            <div className="w-64 h-56 mx-auto mb-4 rounded-lg bg-[url('/canjea-bonos.jpg')] bg-cover bg-center"></div>
            <h3 className="text-orange-700 font-bold text-xl mb-2">Canjea por bonos de supermercado</h3>
            <p className="text-gray-700">Al acumular puntos, podrás intercambiarlos por bonos en supermercados aliados, ayudándote a ahorrar en tus compras.</p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-[#f5eee4] p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            <div className="w-64 h-56 mx-auto mb-4 rounded-lg bg-[url('/compra-productos.jpg')] bg-cover bg-center"></div>
            <h3 className="text-[#A5AF22] font-bold text-xl mb-2">Compra productos reciclados</h3>
            <p className="text-gray-700">Explora nuestra tienda virtual y usa tus puntos para adquirir productos elaborados a partir de plástico reciclado.</p>
          </div>
        </div>
      </section>

      {/* Misión */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-stretch">

          {/* Fondo verde lima */}
          <div className="bg-[#A5AF22] text-white px-10 py-16 w-full md:w-[65%] z-0 rounded-md">
            <h2 className="text-4xl font-bold mb-6">Misión</h2>
            <p className="text-xl leading-relaxed mr-16">
              La misión de la empresa EcoRecicla Panamá es promover y facilitar la práctica del reciclaje al adquirir basura reciclable
              y convertirla en recursos valiosos para su posterior venta. Nuestra empresa se compromete a fomentar la sostenibilidad
              ambiental y contribuir a la economía circular al brindar una solución rentable y eficiente para la gestión de residuos.
            </p>
          </div>

          {/* Imagen */}
          <div className="absolute right-[-80px] top-0 md:top-[-24px] transform translate-y-0 md:w-[55%] w-full z-10">
            <img
              src="/personas-reciclando.png"
              alt="Personas reciclando"
              className="object-cover w-full h-[400px] rounded-md"
            />
          </div>
        </div>
      </section>

      {/* Visión */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-stretch">

          {/* Imagen absoluta a la izquierda */}
          <div className="absolute left-[-100px] top-0 md:top-[-5px] w-full md:w-[55%] z-20">
            <img
              src="/visión-imagen.png"
              alt="Personas reciclando"
              className="object-cover w-full h-[400px] rounded-md"
            />
          </div>

          {/* Bloque verde lima */}
          <div className="bg-[#A5AF22] text-white px-10 py-10 w-full md:w-[62%] rounded-md relative z-10 ml-auto mr-10">
            <h2 className="text-4xl font-bold mb-6">Visión</h2>
            <p className="text-xl leading-relaxed">
              Ser líderes en reciclaje y conciencia ambiental, inspirando un futuro sostenible y responsable para las generaciones venideras.
              Nos esforzamos por crear un mundo en el que el reciclaje sea una práctica habitual y donde la conciencia ambiental sea parte integral de la vida cotidiana.
              A través de innovadoras soluciones y alianzas estratégicas, buscamos influir positivamente en las decisiones individuales y colectivas, promoviendo un estilo de vida respetuoso con el medio ambiente.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 text-center bg-white mb-20 relative">
        <h2 className="text-4xl font-extrabold mb-4">¿Cómo funciona nuestra máquina?</h2>
        <div className="max-w-5xl mx-auto md:flex gap-10 items-start justify-center relative">

          {/* Imagen*/}
          <div className="hidden md:block absolute right-[-400px] top-0 h-full z-10">
            <img
              src="/maquina-2.png"
              alt="Máquina EcoRecicla"
              className="h-[520px] object-contain rounded-lg pointer-events-none"
            />
          </div>

          {/* Pasos */}
          <div className="absolute left-[-250px] space-y-12 md:w-1/2 mt-14 relative z-0">
            {/* Paso 1 */}
            <div className="relative bg-[#bda68b] rounded-lg p-4 pt-4 pl-13">
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-green-900 text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-green-900 mb-1 text-xl">Inicia sesión</h4>
                <p className="text-white text-lg">Accede a tu cuenta desde la app o en nuestra máquina.</p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="relative bg-[#bda68b] rounded-lg p-4 pt-4 pl-13">
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-green-900 text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-xl text-green-900 mb-1">Escanea y deposita</h4>
                <p className="text-white text-lg">Escanea la botella y deposítala en la máquina.</p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="relative bg-[#bda68b] rounded-lg p-4 pt-4 pl-13">
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-green-900 text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-green-900 text-xl mb-1">Gana puntos</h4>
                <p className="text-white text-lg">Recibe puntos por cada botella reciclada.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default HomePage
