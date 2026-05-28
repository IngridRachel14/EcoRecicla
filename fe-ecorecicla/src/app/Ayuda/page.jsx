"use client";
import { useState, useEffect } from "react";
import categories from "./preguntasFrec";
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Ayuda() {
  const [activeCategory, setActiveCategory] = useState("cuenta");
  const [openQuestion, setOpenQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showConsultaForm, setShowConsultaForm] = useState(false); // estado para mostrar formulario
  const [correoConsulta, setCorreoConsulta] = useState("");
  const [textoConsulta, setTextoConsulta] = useState("");
  const [mensajeEnvio, setMensajeEnvio] = useState("");

  const activeFaqs = categories.find((c) => c.key === activeCategory)?.faqs || [];
  const [filteredFaqs, setFilteredFaqs] = useState(activeFaqs);

  useEffect(() => {
    setFilteredFaqs(activeFaqs);
    setSearchTerm("");
    setOpenQuestion(null);
    setShowConsultaForm(false);
    setMensajeEnvio("");
    setCorreoConsulta("");
    setTextoConsulta("");
  }, [activeCategory, activeFaqs]);

 


  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-gray-80 p-6">
        {/* Sección de Barra de Búsqueda */}
        <section className="relative h-[420px] rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[url('/forest.jpg')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-3xl sm:text-4xl font-bold mt-15">¿En qué te podemos Ayudar?</h1>
           
          </div>
        </section>

        {/* Sección de Categorías */}
        <section className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`rounded-lg border px-4 py-15 shadow-md transition-colors duration-500 ${
                activeCategory === cat.key
                  ? "bg-lime-100 border-lime-400"
                  : "bg-white"
              }`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-sm text-center">{cat.title}</div>
            </button>
          ))}
        </section>

        {/* Sección de Preguntas Frecuentes */}
        <section className="mt-8 space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white shadow-lg rounded-lg">
                <button
                  onClick={() => setOpenQuestion(openQuestion === idx ? null : idx)}
                  className="w-full text-left px-4 py-8 font-semibold flex justify-between items-center"
                >
                  {faq.question}
                  <span className="text-xl">
                    {openQuestion === idx ? "▲" : "▼"}
                  </span>
                </button>
                {openQuestion === idx && (
                  <div className="px-4 pb-4 text-gray-700">{faq.answer}</div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No se encontraron preguntas que coincidan.</p>
          )}
        </section>

        
      </div>
      <Footer />
    </main>
  );
}
