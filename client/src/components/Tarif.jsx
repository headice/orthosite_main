import React, { useState } from "react";
import { TicketModal } from "./TicketModal";

export const Tarif = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const CheckIcon = () => (
    <svg
      className="w-5 h-5 text-[#72E4FF] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="px-4 flex flex-col items-center">
      {/* === НАЗВАНИЕ БЛОКА === */}
      <h2
        id="tarific"
        className="text-center text-3xl md:text-4xl font-extrabold text-white mb-10 tracking-wide scroll-mt-20"
      >
        Тариф на участие в интенсиве
      </h2>

      {/* === КАРТОЧКА ТАРИФА === */}
      <div className="w-full max-w-md rounded-[32px] border border-white/20 shadow-white/10 bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58] p-8 text-white shadow-lg">
        <p className="text-center text-xl mb-3 opacity-80">С 05.12 по 19.12</p>

        <h3 className="text-center text-2xl md:text-3xl font-bold mb-6">
          БИЛЕТ НА ИНТЕНСИВ
        </h3>

        <ul className="space-y-4 mb-4 text-left">
          {[
            "2 дня интенсивной практики",
            "Разбор ключевых моментов патологии опорно-двигательного аппарата",
            "Практические инструменты для работы подолога",
            "Выдача сертификатов участника",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckIcon />
              <span className="text-base">{item}</span>
            </li>
          ))}
        </ul>

        <div className="text-center mb-6">
          <p className="text-xl line-through opacity-50 text-orangeff7b00">
            29900₽
          </p>
          <p className="text-3xl font-bold mt-1">25990₽</p>
        </div>

        <button
          onClick={openModal}
          className="w-full rounded-2xl border border-orangeff7b00 text-orangeff7b00 py-3 text-lg font-semibold hover:bg-white/10 transition mb-4"
        >
          Купить билет
        </button>

        {/* === БЛОКИ С ЦЕНАМИ === */}
        <div className="text-left space-y-3 text-sm pt-6">
          {/* Первый блок */}
          <div className="flex justify-between items-start text-2xl">
            <p className="leading-tight mr-4">
              с 20 декабря по 30 декабря
              стоимость <b>⠀⠀⠀⠀⠀⠀</b>  <b className="text-orangeff7b00 text-3xl  text-right">
              26990₽
            </b>
            </p>
          
          </div>

          {/* Второй блок */}
          <div className="flex justify-between items-start text-2xl">
            <p className="leading-tight mr-4">
              С 31 декабря по 28 января
              стоимость <b>⠀⠀⠀⠀⠀⠀</b> <b className="text-orangeff7b00 text-3xl text-right">
              29990₽
            </b>
            </p>
            
          </div>
        </div>
      </div>

      <TicketModal open={isModalOpen} onClose={closeModal} />
    </div>
  );
};
