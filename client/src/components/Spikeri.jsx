import React from 'react'
import arc from "./img/Arc.png"
import pet from "./img/Pet.png"

const speakers = [
  { name: "Иванов Аркадий Николаевич", role: "г. Москва", desc: "Хирург, врач ортопед, травматолог. Техник-ортопед прошедший стажировку в США И Германии. Заведующий лабораторией ортезирования стопы АО «ЦИТО» Госкорпорация Ростех.", image: arc },
  { name: "Петров Дмитрий Олегович", role: "г. Москва", desc: "Инженер-биомеханик, заместитель заведующего лабораторией ортезирования стопы АО «ЦИТО» Госкорпорация Ростех.", image: pet },
];

export const Spikeri = () => {
  return (
    <div id="speakerss" className="scroll-mt-20">
      <section id="speakers" className="">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-200"></p>
        <h2 className="mt-2 text-3xl font-semibold">О спикерах</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {speakers.map((speaker) => (
            <div key={speaker.name} className="rounded-2xl border border-white/80 bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58] p-6">
              {/* Блок с фото и ФИО - адаптивный */}
              <div className="flex flex-col items-center text-center md:flex-row md:items-center md:gap-4 md:text-left">
                {/* Фото */}
                <div 
                  style={{
                    backgroundImage: `url(${speaker.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }} 
                  className="h-40 w-40 rounded-full from-blue-400 to-blue-600 border flex-shrink-0" 
                />
                {/* ФИО и город */}
                <div className="mt-4 md:mt-0 md:flex-1 md:min-w-0">
                  <h3 className="text-xl text-center font-semibold">{speaker.name}</h3>
                  <p className="text-1xl text-center uppercase tracking-wide text-blue-200 mt-1">{speaker.role}</p>
                </div>
              </div>
              {/* Описание */}
              <p className="mt-3 text-2xl text-blue-100 margin-bottom: 20px">{speaker.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
