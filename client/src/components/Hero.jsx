import React, { useState } from "react";
import orthos from "./img/ortho_hero.png";
import heroBack from "./img/hero_back.jpg";
import Tg from "./img/tetega.png";

export const Hero = ({ onBuyTicket }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      id="hero"
      className="relative w-full bg-cover bg-center bg-no-repeat font-sans text-white pt-3 scroll-smooth overflow-x-hidden"
      style={{ backgroundImage: `url(${heroBack})` }}
    >
      {/* затемнение поверх фона */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030a1c]/40 via-[#041b39]/45 to-[#041b39]" />

      {/* ======= ШАПКА ======= */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-6 text-xs uppercase tracking-wide text-blue-100 px-4">
        {/* desktop-меню только с lg */}
        <nav className="hidden lg:flex gap-12 bg-[#030a1c]/40 backdrop-blur-sm px-8 py-4 rounded-2xl border border-blue-800/30">
          <a href="#hero" className="transition hover:text-white hover:scale-105">
            Главная
          </a>
          <a href="#who" className="transition hover:text-white hover:scale-105">
            О интенсиве
          </a>
          <a href="#program" className="transition hover:text-white hover:scale-105">
            Программа
          </a>
          <a href="#speakerss" className="transition hover:text-white hover:scale-105">
            Спикеры интенсива
          </a>
          <a href="#tarific" className="transition hover:text-white hover:scale-105">
            Билет
          </a>
          <a href="#organizers" className="transition hover:text-white hover:scale-105">
            Организаторы
          </a>
          <a href="#contacts" className="transition hover:text-white hover:scale-105">
            Контакты
          </a>
        </nav>

        {/* бургер-меню (до lg) */}
        <button
          type="button"
          className="lg:hidden absolute right-4 top-6 inline-flex h-9 w-9 items-center justify-center"
          onClick={() => setMenuOpen(true)}
        >
          <span className="flex flex-col justify-between h-5">
            <span className="h-[3px] w-7 bg-white rounded-full" />
            <span className="h-[3px] w-7 bg-white rounded-full" />
            <span className="h-[3px] w-7 bg-white rounded-full" />
          </span>
        </button>
      </header>

      {/* ======= МОБИЛЬНОЕ МЕНЮ ======= */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
        <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-[#101735] px-6 py-8 flex flex-col text-base">
          <button
            className="self-end text-2xl text-white"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>

          <nav className="mt-6 flex flex-col gap-3 text-sm">
            <a
              href="#hero"
              className="hover:text-white py-2"
              onClick={() => setMenuOpen(false)}
            >
              Главная
            </a>
            <a
              href="#who"
              className="hover:text-white py-2"
              onClick={() => setMenuOpen(false)}
            >
              О интенсиве
            </a>
            <a
              href="#program"
              className="hover:text-white py-2"
              onClick={() => setMenuOpen(false)}
            >
              Программа
            </a>
            <a
              href="#speakerss"
              className="hover:text-white py-2"
              onClick={() => setMenuOpen(false)}
            >
              Спикеры интенсива
            </a>
            <a
              href="#tarific"
              className="hover:text-white py-2"
              onClick={() => setMenuOpen(false)}
            >
              Билет
            </a>
            <a
              href="#organizers"
              className="hover:text-white py-2"
              onClick={() => setMenuOpen(false)}
            >
              Организаторы
            </a>
            <a
              href="#contacts"
              className="hover:text-white py-2"
              onClick={() => setMenuOpen(false)}
            >
              Контакты
            </a>
          </nav>
        </div>
      </div>

      {/* ======= ОСНОВНОЙ КОНТЕНТ ======= */}
      {/* 
        pb-6 на мобилках, чтобы текст не лип к бегущей строке,
        и lg:pb-0 на десктопе — НЕТ отступа между картинкой и жёлтой полосой
      */}
      <div className="relative z-10 w-full pt-24 md:pt-20 pb-6 lg:pb-0">
        <div className="max-w-7xl mx-auto px-6">
          {/* Текст слева */}
          <div className="w-full text-left">
            <p className="text-xl font-normal uppercase tracking-[0.35em] text-blue-200">
              2-х дневный интенсив
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl font-montserrat">
              ВВЕДЕНИЕ В ОРТОПЕДИЮ
            </h1>

            <p className="mt-6 max-w-lg text-lg text-blue-100">
             Практическая ортопедия для подологов, шагаем в ногу со временем.
            </p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-blue-100">
              <span>28-29 марта 2026</span>
              <span>Владивосток • </span>
            </div>
          </div>

          {/* ===== СПИКЕРЫ ===== */}
          <div
            id="speakers"
            className="mt-16 flex flex-col lg:flex-row justify-between items-center lg:items-center gap-10"
          >
            {/* левый спикер */}
            <div className="w-64 text-center lg:text-right pt-8 lg:pt-16">
              <h3 className="text-2xl font-semibold">
                Иванов Аркадий Николаевич
              </h3>
              <p className="mt-3 text-blue-200">спикер</p>
            </div>

            {/* фото */}
            <div className="flex justify-center overflow-hidden">
              <img
                src={orthos}
                alt="Спикеры"
                className="block w-full max-w-sm lg:max-w-lg object-contain"
              />
            </div>

            {/* правый спикер + кнопки */}
            <div className="w-full max-w-[22rem] flex flex-col items-center lg:items-start text-center lg:text-left pt-8 lg:pt-16">
              <h3 className="text-2xl font-semibold">
                Петров Дмитрий Олегович
              </h3>
              <p className="mt-3 text-blue-200">спикер</p>

              <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="flex w-full flex-col gap-4">
                  <button
                    onClick={onBuyTicket}
                    className="w-full min-w-[260px] rounded-2xl border border-blue-200/60 px-8 py-4 font-semibold uppercase tracking-wide transition hover:border-white hover:bg-white/10"
                  >
                    Купить билет
                  </button>

                  <a
                    href="#program"
                    className="w-full min-w-[260px] rounded-2xl border border-blue-200/60 px-8 py-4 text-center font-semibold uppercase tracking-wide transition hover:border-white hover:bg-white/10"
                  >
                    Программа интенсива
                  </a>
                </div>

             
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
