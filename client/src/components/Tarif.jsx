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
          
          <p className="text-3xl font-bold mt-1">30000₽</p>
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
          <div className="flex justify-between items-start text-lg md:text-2xl">
            <p className="leading-tight mr-4">
              с 03 февраля по 20 февраля
              стоимость <b>⠀⠀⠀</b>  <b className="text-orangeff7b00 text-2xl md:text-3xl text-right">
              24990₽
            </b>
            </p>
          
          </div>

          {/* Второй блок */}
          <div className="flex justify-between items-start text-lg md:text-2xl">
            <p className="leading-tight mr-4">
              С 21 февраля по 27 марта
              стоимость <b>⠀⠀⠀</b> <b className="text-orangeff7b00 text-2xl md:text-3xl text-right">
              30000₽
            </b>
            </p>
            
          </div>
        </div>

        {/* АДАПТИВ ДЛЯ ТЕЛЕФОНОВ 375px И НИЖЕ */}
        <style jsx>{`
          @media (max-width: 395px) {
            /* Блок с ценами под кнопкой */
            .pt-6 {
              padding-top: 1rem !important;
            }
            
            /* Каждый блок с датой и ценой */
            .pt-6 > div {
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
              margin-bottom: 1.25rem !important;
              font-size: 0.9rem !important;
            }
            
            /* Текст с датами */
            .pt-6 > div > p {
              margin-right: 0 !important;
              margin-bottom: 0.4rem !important;
              font-size: 0.9rem !important;
              line-height: 1.3 !important;
              text-align: center !important;
              width: 100% !important;
              white-space: normal !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
            }
            
            /* Оранжевые цены */
            .pt-6 > div > p > b.text-orangeff7b00 {
              text-align: center !important;
              display: block !important;
              font-size: 1.4rem !important;
              font-weight: bold !important;
              width: 100% !important;
              margin-top: 0.25rem !important;
              order: 2 !important;
            }
            
            /* Даты и слово "стоимость" */
            .pt-6 > div > p {
              color: rgba(255, 255, 255, 0.9) !important;
            }
            
            /* Пустые пробелы - скрываем */
            .pt-6 > div > p > b:empty {
              display: none !important;
            }
          }
          
          /* Дополнительно для очень маленьких < 320px */
          @media (max-width: 320px) {
            .pt-6 > div > p {
              font-size: 0.85rem !important;
            }
            
            .pt-6 > div > p > b.text-orangeff7b00 {
              font-size: 1.25rem !important;
            }
          }
        `}</style>
      </div>

      <TicketModal open={isModalOpen} onClose={closeModal} />
    </div>
  );
};
