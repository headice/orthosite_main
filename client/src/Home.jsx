import React, { useState } from "react";
import { Hero } from "./components/Hero";
import { TicketModal } from "./components/TicketModal";
import { Intensiv } from "./components/Intensiv";
import { Spikeri } from "./components/Spikeri";
import { RunningString } from "./components/RunningString";
import Programma from "./components/Programma";
import { Tarif } from "./components/Tarif";
import { Organizatori } from "./components/Organizatori";
import { Contacts } from "./components/Contacts";
import { ConsultationModal } from "./components/ConsultationModal";

import bgImage from "./components/img/after_hero_back.png";

export const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConsultationOpen, setConsultationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030b1f] text-white scroll-smooth ">
      <Hero
        onBuyTicket={() => setModalOpen(true)}
        onConsultation={() => setConsultationOpen(true)}
      />

      <RunningString />

      <div
        className="bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16">
          <Intensiv />
          <Programma />
          <Spikeri />
          <Tarif />
          <Organizatori />
          <Contacts />
        </main>
      </div>

      <TicketModal open={isModalOpen} onClose={() => setModalOpen(false)} />
      <ConsultationModal open={isConsultationOpen} onClose={() => setConsultationOpen(false)} />
    </div>
  );
};
