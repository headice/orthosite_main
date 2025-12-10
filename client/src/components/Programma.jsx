import React, { useState } from "react";
import ehik from "../components/img/eh.png";

const data = [
  {
    id: 1,
    title: "Общие основы и значение ортопедии в подологии",
    details: [
      "Понятие «Ортопедия». Значение знания по ортопедии в практике подолога.",
      "Симптомы и заболевания по нозологии.",
      "Основы педиатрической диагностики."
    ]
  },
  {
    id: 2,
    title: "Диагностика и сбор анамнеза",
    details: [
      "Корреляция анамнестических данных и причинно-следственные связи в формировании наиболее частых патологий в подологической практике.",
      "Особенности сбора анамнестических данных.",
      "Иридодиагностика. Диагностика по плантограмме."
    ]
  },
  {
    id: 3,
    title: "Патологии стопы и опорно-двигательного аппарата (ОДА)",
    details: [
      "Плоскостопие и его осложнения, заболевания позвоночника.",
      "Диабетическая стопа - ведение пациента. Особенности."
    ]
  },
  {
    id: 4,
    title: "Возрастные аспекты ортопедии",
    details: [
      "Детская ортопедия.",
      "Развитие младенческой стопы.",
      "Возраст 3-7 лет, активное формирование ОДА, главное в этом периоде, профилактика плоскостопия у детей.",
      "Взрослая ортопедия (особые состояния) :",
      "Беременность и правильная стопа.",
      "Осложнения ОДА после беременности.",
      "Опасные последствия и способы их предотвращения."
    ]
  },
  {
    id: 5,
    title: "Ортезирование и коррекция",
    details: [
      "Виды ортезов.",
      "Снятие слепков.",
      "Методики лечения. Коррекция нарушений опорно-двигательной системы.",
      "Изготовление ортезов-супинаторов от вида патологии.",
      "Технология ортезирования термоформирующимся ортезами стоп.",
      "Сенсомоторные и проприоцептивные супинаторы: принципы работы, особенности, механизм действия."
    ]
  },
  {
    id: 6,
    title: "Обувь и двигательная активность",
    details: [
      "Виды обуви. Как правильно подбирать обувь взрослым и детям.",
      "Босоногая обувь.",
      "Спорт и обувь. Виды спорта и правила подбора.",
      "Спорт: травмы, как избежать заболеваний опорно-двигательной системы."
    ]
  },
  {
    id: 7,
    title: "Консервативные методы лечения и ответы на вопросы",
    details: [
      "ЛФК.",
      "Ответы на все интересующие Вас вопросы, основные методы лечения и коррекции стоп."
    ]
  },
  {
    id: 8,
    title: "Элексир здоровья от дальневосточных ученых!",
    details: [
      "У вас будет возможность познакомиться и приобрести инновационное профилактическое питание на основе морских биоресурсов Японского моря.",
      "Уникальная формула с доказанной эффективностью для укрепления вашего здоровья."
    ]
  }
];

export default function Programma() {
  const [openItems, setOpenItems] = useState([]);

  const toggle = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderCard = (item) => {
    const isOpen = openItems.includes(item.id);

    return (
      <div 
        key={item.id}
        className="relative w-full md:w-[calc(33.333%-16px)] lg:w-[calc(33.333%-16px)] 
                   p-6 rounded-3xl border border-white/80 shadow-white/10 bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58]
                   text-white shadow-xl flex flex-col self-start
                   min-h-[260px]"
      >
        {/* --- декор только для карточки 8 --- */}
        {item.id === 8 && (
          <img
            src={ehik}
            alt=""
            className="absolute -top-12 -right-5 w-28 h-29 opacity-90 pointer-events-none"
          />
        )}

        <div className="flex-1 flex flex-col">
          <span className="flex items-center text-4xl font-bold">
            {String(item.id).padStart(2, "")}
          </span>

          <h3 className="mt-2 text-2xl font-semibold leading-tight text-left">
            {item.title}
          </h3>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              isOpen ? "max-h-[600px] mt-4" : "max-h-0"
            }`}
          >
            <ul className="list-disc pl-5 text-left">
              {item.details.map((d, i) => (
                <li key={i} className="mb-2">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          className="mt-6 w-full text-sm px-4 py-2 rounded-xl border border-blue-300 text-blue-300 hover:bg-blue-300/20"
          onClick={() => toggle(item.id)}
        >
          {isOpen ? "Свернуть" : "Подробнее"}
        </button>
      </div>
    );
  };

  return (
    <section>
      <h2 id="program" className="text-3xl font-bold text-white mb-10 scroll-mt-20">Программа интенсива</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {data.map((item) => renderCard(item))}
      </div>

      {/* Медиа-запросы для адаптива */}
      <style jsx>{`
        @media (max-width: 767px) {
          .flex-wrap > div {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1024px) {
          .flex-wrap > div {
            width: calc(50% - 12px) !important;
            max-width: calc(50% - 12px) !important;
          }
        }
        
        @media (min-width: 1025px) {
          .flex-wrap > div {
            width: calc(33.333% - 16px) !important;
            max-width: calc(33.333% - 16px) !important;
          }
        }
      `}</style>
    </section>
  );
}