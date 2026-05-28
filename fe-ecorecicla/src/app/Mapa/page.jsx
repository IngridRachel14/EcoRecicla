"use client";
import React from 'react'
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
import GoogleMaps from "@/components/Google-Maps"

function mappage() {

  const markers =
    [
      {
        //Edificio de Facilidades Estudiantiles
        lat: 9.023625, lng: -79.532531,
        title: 'Maquina 1 ecorecicla Panamá'
      },

      {
        //Altaplaza Mall
        lat: 9.030088055527521, lng: -79.53407710985618,
        title: 'Maquina 2 Ecorecicla Panamá '


      },

      {
        //Super Xtra Condado del Rey
        lat: 9.02645631752063, lng: -79.52183121536882,
        title: 'Maquina 3 Ecorecicla Panamá '
      },

      //Ribas Smith de Multiplaza
      {
        lat: 8.985965293372997, lng: -79.5101916582123,
        title: 'Maquina 4 Ecorecicla Panamá'

      },

    ]
  return (

    <div>
      <Navbar />
      <GoogleMaps markers={markers} />
      <Footer />
    </div>


  )
}
export default mappage