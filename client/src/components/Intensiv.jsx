import React from 'react'
import whoTop from "../components/img/whup_top.png";
import whoBottom from "../components/img/whup_rop.png";
import Tips from "../components/img/tips.png";
import Noga from "../components/img/noga.png";

export const Intensiv = () => {
  return (
    <div className='animate-fadeUp scroll-smooth'>
      <section id="who" className="rounded-[32px] p-8 scroll-mt-10">

        {/* Заголовок */}
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-white">
          Кому будет полезен этот интенсив?
        </h2>

        {/* Плашка */}
        <div className="mt-6 mx-auto bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                        text-center text-white px-6 py-4 rounded-[18px] shadow-lg border border-white/80 shadow-white/10 max-w-5xl">
          <p className="font-semibold text-sm md:text-2xl">
            Курс «Введение в ортопедию для подологов»
          </p>
          <p className="mt-1 text-xs md:text-2xl">
            Двухдневный интенсив созданный для специалистов, желающих углубить знания
            в области ортопедии и биомеханики стопы.
          </p>
        </div>

          {/* 8 блоков - адаптивная сетка */}
          <div
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4 justify-items-center"
          >
            {/* 1 — текст */}
            <div className="order-1 md:order-none border border-white/80 shadow-white/10 bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                            mx-auto w-full max-w-[300px] p-6 rounded-3xl border border-white/20 shadow-lg mb-6 md:mb-0">
              <p className="flex items-center text-2xl font-bold">1</p>
              <p className=" text-left text-sm md:text-lg leading-relaxed">
                C ведущими экспертами ФГУП ЦИТО вы разберёте ключевые патологии опорно-двигательного аппарата
              </p>
            </div>

            {/* 2 — фото */}
            <div className="order-2 md:order-none h-[200px] w-full max-w-[300px] mx-auto rounded-3xl overflow-hidden mb-6 md:mb-0">
              <img src={whoTop} className="w-full h-full object-cover" alt="Фото 1" />
            </div>

            {/* 3 — текст */}
            <div className="order-3 md:order-none border border-white/80 shadow-white/10 bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                            mx-auto w-full max-w-[300px] p-6 rounded-3xl border border-white/20 shadow-lg mb-6 md:mb-0">
              <p className="flex items-center text-2xl font-bold">2</p>
              <p className=" text-left text-sm md:text-lg leading-relaxed">
                Вы получите практические инструменты для оценки состояния стопы и позвоночника
              </p>
            </div>

            {/* 4 — фото */}
            <div className="order-4 md:order-none h-[200px] w-full max-w-[300px] mx-auto rounded-3xl overflow-hidden mb-6 md:mb-0">
              <img src={whoBottom} className="w-full h-full object-cover" alt="Фото 2" />
            </div>

            {/* 5 — фото (на мобильном идёт после текста, поэтому order-6) */}
            <div className="order-6 md:order-none h-[200px] w-full max-w-[300px] mx-auto rounded-3xl overflow-hidden mb-6 md:mb-0">
              <img src={Tips} className="w-full h-full object-cover" alt="Фото 3" />
            </div>

            {/* 6 — текст */}
            <div className="order-5 md:order-none border border-white/80 shadow-white/10 bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                            mx-auto w-full max-w-[300px] p-6 rounded-3xl border border-white/20 shadow-lg mb-6 md:mb-0">
              <p className="flex items-center text-2xl font-bold">3</p>
              <p className=" text-left text-sm md:text-lg leading-relaxed">
                Научитесь проводить диагностику и определять причины проблем со стопой
              </p>
            </div>

            {/* 7 — фото (на мобильном после текста — order-8) */}
            <div className="order-8 md:order-none
                  h-[200px] w-full max-w-[300px]
                  mx-auto rounded-3xl overflow-hidden
                  mb-6 md:mt-0 md:mb-0">
              <img src={Noga} className="w-full h-full object-cover" />
            </div>

            {/* 8 — текст */}
            <div className="order-7 md:order-none border border-white/80 shadow-white/10 bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58] w-full max-w-[300px]
                                mx-auto p-6 rounded-3xl border border-white/20 shadow-lg
                                mb-6 md:mb-0">
              <p className="flex items-center text-2xl font-bold">4</p>
              <p className=" text-left text-sm md:text-lg leading-relaxed">
                Также разберёте ведение пациентов с диабетической стопой и подбор ортопедической обуви
              </p>
            </div>
          </div>

      </section>
    </div>
  )
}
