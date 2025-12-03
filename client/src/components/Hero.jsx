import React, { useState } from "react";
import orthos from "./img/ortho_hero.png";
import heroBack from "./img/hero_back.jpg";

export const Hero = ({ onBuyTicket }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      id="hero"
      className="relative w-full bg-cover bg-center bg-no-repeat font-sans text-white pt-3 scroll-smooth"
      style={{ backgroundImage: `url(${heroBack})` }}
    >
      {/* Затемнение поверх фона */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030a1c]/40 via-[#041b39]/45 to-[#041b39]" />

      {/* ======= ШАПКА ======= */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-6 text-xs uppercase tracking-wide text-blue-100 px-4">
        {/* Десктоп-меню по центру с темным фоном */}
        <nav className="hidden md:flex gap-12 bg-[#030a1c]/40 backdrop-blur-sm px-8 py-4 rounded-2xl border border-blue-800/30">
          <a href="#hero" className="transition hover:text-white hover:scale-105">
            Главная
          </a>
          <a href="#who" className="transition hover:text-white hover:scale-105">
            О форуме
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

        {/* Бургер-иконка (только мобилка) */}
        <button
          type="button"
          className="md:hidden absolute right-4 top-6 inline-flex h-9 w-9 items-center justify-center"
          onClick={() => setMenuOpen(true)}
          aria-label="Открыть меню"
        >
          <span className="flex flex-col justify-between h-5">
            <span className="h-[3px] w-7 bg-white rounded-full" />
            <span className="h-[3px] w-7 bg-white rounded-full" />
            <span className="h-[3px] w-7 bg-white rounded-full" />
          </span>
        </button>
      </header>

      {/* ======= ВЫЕЗЖАЮЩЕЕ МЕНЮ (мобилка) ======= */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* полупрозрачный фон слева */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />

        {/* панель */}
        <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-[#101735] px-6 py-8 flex flex-col text-base">
          {/* крестик */}
          <button
            className="self-end text-2xl text-white"
            onClick={() => setMenuOpen(false)}
            aria-label="Закрыть меню"
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
              О форуме
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

      {/* ======= КОНТЕНТ ======= */}
      <div className="relative z-10 w-full pt-24 md:pt-20">
        {/* Остальной контент без изменений */}
        <div className="w-full text-left pl-4 md:pl-10 xl:pl-16">
          <p className="text-xl font-normal uppercase tracking-[0.35em] text-blue-200">
            2-х дневный интенсив
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl font-montserrat">
            ВВЕДЕНИЕ В ОРТОПЕДИЮ
          </h1>

          <p className="mt-6 max-w-lg text-lg text-blue-100">
            Форум, где создается будущее современной медицины. Ортопедия: от
            диагностики до коррекции
          </p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-blue-100">
            <span>29–30 января 2026</span>
            <span>Новосибирск • Зал «Ярославль»</span>
          </div>
        </div>

        {/* Спикеры */}
        <div
          id="speakers"
          className="mt-16 flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-20 relative"
        >
          {/* Левый спикер */}
          <div className="w-64 max-w-xs text-center lg:text-right">
            <h3 className="text-2xl font-semibold">
              Иванов Аркадий Николаевич
            </h3>
            <p className="mt-3 text-blue-200">спикер</p>
          </div>

          {/* Фото */}
          <div className="flex justify-center overflow-hidden">
            <img
              src={orthos}
              alt="Спикеры"
              className="block w-full max-w-sm lg:max-w-lg object-contain"
            />
          </div>

          {/* Правый спикер + кнопки */}
          <div className="relative w-64 max-w-xs text-center lg:text-left pb-6 lg:pb-0">
            <h3 className="text-2xl font-semibold">
              Петров Дмитрий Олегович
            </h3>
            <p className="mt-3 text-blue-200">спикер</p>

            <div
              className="
                mt-6 flex flex-col gap-4
                lg:absolute lg:right-0 lg:bottom-0 lg:translate-y-32 lg:translate-x-32
              "
            >
              <button
                onClick={onBuyTicket}
                className="rounded-2xl border border-blue-200/60 px-8 py-4 font-semibold uppercase tracking-wide transition hover:border-white hover:bg-white/10"
              >
                Купить билет
              </button>

              <a
                href="#program"
                className="rounded-2xl border border-blue-200/60 px-8 py-4 text-center font-semibold uppercase tracking-wide transition hover:border-white hover:bg-white/10"
              >
                Программа форума
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};