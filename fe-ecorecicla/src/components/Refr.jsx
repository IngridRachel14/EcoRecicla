
"use client"
import { useState } from "react"
import { Copy, User2, Trophy } from "lucide-react"
import { FaWhatsapp, FaCoins } from "react-icons/fa"
import {
  BarChart,
  Bar,
  XAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const shareUrl = "https://m.eco.co/c/b32e76779122"
const pieData = [
  { name: "Activos", value: 70 },
  { name: "Inactivos", value: 30 },
]
const barData = [
  { name: "Semana 1", value: 5 },
  { name: "Semana 2", value: 8 },
  { name: "Semana 3", value: 10 },
  { name: "Semana 4", value: 12 },
]
const lineData = [
  { name: "Semana 1", puntos: 100 },
  { name: "Semana 2", puntos: 250 },
  { name: "Semana 3", puntos: 300 },
  { name: "Semana 4", puntos: 400 },
]
const COLORS = ["#2ECC71", "#F4F4F4"]

const Refr = () => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openWhatsApp = () => {
    const text = encodeURIComponent(`¡Mira este enlace! ${shareUrl}`)
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lado izquierdo */}
        <div className="flex flex-col items-center">
          {/* Tarjeta compartir */}
          <div className="max-w-xl w-full p-4 bg-pink-50 border border-gray-300 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-center">Comparte tu URL única</h3>
            <p className="text-center text-gray-700 mb-4">
              Copia tu enlace único y compártelo con tus amigos y seguidores.
            </p>

            <div className="flex items-center gap-2 bg-gray-300 rounded px-2 py-2">
              <span className="flex-1 text-sm break-all text-blue-900 font-medium">
                {shareUrl}
              </span>

              <button
                onClick={copyToClipboard}
                className="bg-white p-2 rounded hover:bg-gray-100 transition"
                title="Copiar"
              >
                <Copy className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={openWhatsApp}
                className="bg-green-700 p-2 rounded hover:bg-green-800 transition"
                title="Compartir en WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5 text-white" />
              </button>
            </div>

            {copied && (
              <div className="text-green-600 text-sm mt-2 text-center font-medium">
                ¡Enlace copiado!
              </div>
            )}
          </div>

         
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
            <div className="flex flex-col items-center justify-center w-52 h-40 bg-pink-50 border border-gray-300 rounded-2xl shadow-md">
              <User2 className="w-10 h-10 text-black mb-2" />
              <div className="text-xl font-bold">10</div>
              <div className="text-sm text-gray-700 mt-1">Total de Referidos</div>
            </div>

            <div className="flex flex-col items-center justify-center w-52 h-40 bg-pink-50 border border-gray-300 rounded-2xl shadow-md">
              <FaCoins className="w-10 h-10 text-green-600 mb-2" />
              <div className="text-xl font-bold">1000</div>
              <div className="text-sm text-gray-700 mt-1">Puntos Ganados</div>
            </div>
          </div>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pink-50 p-4 border border-gray-300 rounded-2xl shadow-md">
         
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Referidos por Semana</h4>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <Bar dataKey="value" fill="#2ECC71" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

      
          <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col items-center justify-center">
            <h4 className="text-sm font-semibold mb-2">70% Activos</h4>
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={30}
                  outerRadius={40}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs mt-1 text-gray-600">Referidos actvs/inactvs</p>
          </div>

        
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Progreso hacia la Meta</h4>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-green-500 h-2 rounded" style={{ width: "66%" }} />
              </div>
            </div>
            <p className="text-sm text-center mt-2">10/15 Referidos</p>
          </div>

        
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Puntos Ganados por Semana</h4>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="puntos"
                  stroke="#2ECC71"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Refr;


