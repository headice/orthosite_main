import React, { useState } from "react";
import { Hero } from "./components/Hero";
import { TicketModal } from "./components/TicketModal";
import { Intensiv } from "./components/Intensiv";
import { Spikeri } from "./components/Spikeri";
import  Footer from "./components/Footer.jsx"
import { RunningString } from "./components/RunningString"
import Programma from "./components/Programma";
import { Tarif } from "./components/Tarif";
import { Organizatori } from "./components/Organizatori";
import { Contacts } from "./components/Contacts";

// фон после hero
import bgImage from "./components/img/after_hero_back.png";





// картинки для секции "Кому будет полезен"




export const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen bg-[#030b1f] text-white scroll-smooth ">
      {/* Hero */}
      <Hero onBuyTicket={openModal} />

      {/* бегущая строка */}
      
      <RunningString></RunningString>
      {/* ОБОЛОЧКА С ФОНОМ */}
      <div
        className="bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16">
          {/* Кому будет полезен интенсив */}
             <Intensiv></Intensiv>
          {/* Программа */}
         <Programma></Programma>

          {/* Спикеры */}
          <Spikeri></Spikeri>

          {/* Тарифы */}
          <Tarif></Tarif>

          {/* Организаторы */}
          <Organizatori></Organizatori>

          {/* Контакты */}
          <Contacts></Contacts>
        </main>

        
      </div>

      <TicketModal open={isModalOpen} onClose={closeModal} />
    </div>
  );
};
