import React from 'react';
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
import Refr from "@/components/Refr";


export default function Referidos() {
  return (
    <div>
    <Navbar/>
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-10 px-4">

     <Refr/>
    </main>
    <Footer/>
    </div>
  )
}
