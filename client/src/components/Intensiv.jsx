import React from "react";

import whoTop from "../components/img/whup_top.png";
import whoBottom from "../components/img/whup_rop.png";
import Tips from "../components/img/tips.png";
import Noga from "../components/img/noga.png";
import Tg from "../components/img/tetega.png";

export const Intensiv = () => {
  return (
    <div className="animate-fadeUp scroll-smooth">
      <section id="who" className="rounded-[32px] p-8 scroll-mt-10">
        {/* Заголовок */}
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-white">
          Кому будет полезен этот интенсив?
        </h2>

        {/* Плашка */}
        <div
          className="mt-6 mx-auto bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                        text-center text-white px-6 py-4 rounded-[18px] shadow-lg border border-white/80 shadow-white/10 max-w-5xl"
        >
          <p className="font-semibold text-base md:text-2xl">
            Курс «Введение в ортопедию для подологов»
          </p>
          <p className="mt-1 text-sm md:text-2xl">
            Двухдневный интенсив созданный для специалистов, желающих углубить
            знания в области ортопедии и биомеханики стопы.
          </p>
        </div>

        {/* 8 блоков - адаптивная сетка */}
        <div
          className="mt-10 flex flex-col md:grid md:justify-center md:gap-8"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 350px)",
            maxWidth: "1400px",
            margin: "2.5rem auto 0",
            gap: "2rem",
          }}
        >
          {/* 1 — текст */}
          <div
            className="order-1 md:order-none bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                          mx-auto p-6 rounded-3xl border border-white/20 shadow-lg mb-4 md:mb-0 w-full max-w-[350px] md:max-w-none
                          min-h-[200px] md:min-h-0 flex flex-col justify-center"
          >
            <p className="flex items-center text-2xl font-bold">1</p>
            <p className="text-left text-base md:text-lg leading-relaxed">
              C ведущими экспертами АО «ЦИТО» Госкорпорация Ростех вы разберёте
              ключевые патологии опорно-двигательного аппарата
            </p>
          </div>

          {/* 2 — фото */}
          <div className="order-2 md:order-none h-[180px] md:h-[200px] w-full max-w-[350px] mx-auto rounded-3xl overflow-hidden mb-4 md:mb-0 md:w-full">
            <img src={whoTop} className="w-full h-full object-cover" alt="Фото 1" />
          </div>

          {/* 3 — текст */}
          <div
            className="order-3 md:order-none bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                          mx-auto p-6 rounded-3xl border border-white/20 shadow-lg mb-4 md:mb-0 w-full max-w-[350px] md:max-w-none
                          min-h-[200px] md:min-h-0 flex flex-col justify-center"
          >
            <p className="flex items-center text-2xl font-bold">2</p>
            <p className="text-left text-base md:text-lg leading-relaxed">
              Вы получите практические инструменты для оценки состояния стопы и
              позвоночника
            </p>
          </div>

          {/* 4 — фото */}
          <div className="order-4 md:order-none h-[180px] md:h-[200px] w-full max-w-[350px] mx-auto rounded-3xl overflow-hidden mb-4 md:mb-0 md:w-full">
            <img
              src={whoBottom}
              className="w-full h-full object-cover"
              alt="Фото 2"
            />
          </div>

          {/* 5 — фото (на мобильном идёт после текста, поэтому order-6) */}
          <div className="order-6 md:order-none h-[180px] md:h-[200px] w-full max-w-[350px] mx-auto rounded-3xl overflow-hidden mb-4 md:mb-0 md:w-full">
            <img src={Tips} className="w-full h-full object-cover" alt="Фото 3" />
          </div>

          {/* 6 — текст */}
          <div
            className="order-5 md:order-none bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                          mx-auto p-6 rounded-3xl border border-white/20 shadow-lg mb-4 md:mb-0 w-full max-w-[350px] md:max-w-none
                          min-h-[200px] md:min-h-0 flex flex-col justify-center"
          >
            <p className="flex items-center text-2xl font-bold">3</p>
            <p className="text-left text-base md:text-lg leading-relaxed">
              Научитесь проводить диагностику и определять причины проблем со
              стопой
            </p>
          </div>

          {/* 7 — фото (на мобильном после текста — order-8) */}
          <div
            className="order-8 md:order-none h-[180px] md:h-[200px] w-full max-w-[350px]
                       mx-auto rounded-3xl overflow-hidden mb-4 md:mt-0 md:mb-0 md:w-full"
          >
            <img src={Noga} className="w-full h-full object-cover" alt="Фото 4" />
          </div>

          {/* 8 — текст */}
          <div
            className="order-7 md:order-none bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58] w-full max-w-[350px]
                          mx-auto p-6 rounded-3xl border border-white/20 shadow-lg mb-4 md:mb-0 md:max-w-none
                          min-h-[200px] md:min-h-0 flex flex-col justify-center"
          >
            <p className="flex items-center text-2xl font-bold">4</p>
            <p className="text-left text-base md:text-lg leading-relaxed">
              Также разберёте ведение пациентов с диабетической стопой и подбор
              ортопедической обуви
            </p>
          </div>
        </div>

        <div
          className="mt-8 mx-auto bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                text-center text-white px-6 py-4 rounded-[18px] shadow-lg border border-white/80 
                shadow-white/10 max-w-3xl"
        >
          <p className="font-semibold text-base md:text-2xl mb-4">
            Про это и не только вы можете узнать в нашем Телеграмм канале!
          </p>

          <div className="flex justify-center">
            <a
              href="https://t.me/+x9U2vQkJ5M1mOTIy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={Tg}
                alt="Telegram"
                className="w-14 h-14 md:w-10 md:h-10 lg:w-14 lg:h-14 hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* Медиа-запросы для адаптива */}
        <style>{`
          /* Для разрешений 1440px - 1500px */
          @media (min-width: 1440px) and (max-width: 1500px) {
            #who > div:nth-child(3) {
              grid-template-columns: repeat(4, 320px) !important;
              max-width: 1300px !important;
              margin: 2.5rem auto 0 !important;
              gap: 1.5rem !important;
            }
            
            #who > div:nth-child(3) > div {
              max-width: 320px !important;
            }
          }
          
          @media (max-width: 1024px) and (min-width: 768px) {
            #who > div:nth-child(3) {
              grid-template-columns: repeat(2, 1fr) !important;
              max-width: 720px !important;
              margin: 2.5rem auto 0 !important;
              gap: 2rem !important;
            }
          }
          
          @media (max-width: 767px) {
            #who > div:nth-child(3) {
              display: flex !important;
              flex-direction: column !important;
              margin-top: 2.5rem !important;
              gap: 1rem !important;
            }
            
            #who > div:nth-child(3) > div {
              margin-bottom: 1rem !important;
            }
          }
          
          @media (min-width: 1501px) {
            #who > div:nth-child(3) {
              grid-template-columns: repeat(4, 350px) !important;
              max-width: 1400px !important;
              margin: 2.5rem auto 0 !important;
              gap: 2rem !important;
            }
          }
          
          @media (min-width: 1025px) and (max-width: 1439px) {
            #who > div:nth-child(3) {
              grid-template-columns: repeat(4, 350px) !important;
              max-width: 1400px !important;
              margin: 2.5rem auto 0 !important;
              gap: 2rem !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
};
