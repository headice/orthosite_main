import React from "react";
import Nat from "../components/img/Natalia.png";
import Logo from "../assets/9.svg";

export const Organizatori = () => {
  return (
    <div id="organizers" className="scroll-mt-20">
      {/* Заголовок ВНЕ синего блока */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          ОРГАНИЗАТОРЫ
        </h2>
      </div>

      {/* Синий блок */}
      <section
        
        className="w-full rounded-[32px] border border-white/80 shadow-white/10 
                 bg-gradient-to-br from-[#122C58] via-[#1D478F] to-[#122C58] 
                 p-8 md:p-12 text-white"
      >
        {/* Мобильная версия - скрыта на десктопе */}
        <div className="md:hidden flex flex-col items-center gap-5 mb-8 text-center px-6">
          <img
            src={Nat}
            alt="Фото организатора"
            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl shadow-lg"
          />

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold leading-tight">
              Михайдарова Наталья Владимировна
            </h3>
            <p className="text-blue-100 text-sm sm:text-base leading-snug">
              Основатель центра «Вектор Здоровья»
            </p>
            <p className="text-blue-200 text-sm sm:text-base leading-snug">г. Артем</p>
          </div>

          <div className="w-full flex justify-center">
            <img
              src={Logo}
              alt="Логотип Вектор Здоровья"
              className="w-[92%] max-w-[360px] h-auto drop-shadow-md"
            />
          </div>
        </div>

        {/* Десктоп версия - скрыта на мобильных */}
        <div className="hidden md:flex items-center justify-between gap-6 mb-6 px-4">
          <div className="flex items-center gap-4">
            <img
              src={Nat}
              alt="Фото организатора"
              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl shadow-lg"
            />

            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold">
                Михайдарова Наталья Владимировна
              </h3>
              <p className="text-blue-100 text-lg leading-tight">
                Основатель центра «Вектор Здоровья»
              </p>
              <p className="text-blue-200">г. Артем</p>
            </div>
          </div>

          <img
            src={Logo}
            alt="Логотип Вектор Здоровья"
            className="h-20 lg:h-24 w-auto drop-shadow-md"
          />
        </div>
        

        
        <div className="text-center ">
          <p className="text-lg md:text-2xl">
            «Вектор Здоровья» – первый и единственный центр на Дальнем Востоке,
            который объединяет все этапы заботы о вашем здоровье: от стопы до питания.
          </p>
        </div>

        
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          
          {/* Левая колонка */}
          <div className="rounded-3xl bg-[#1c3f8a] p-6 md:p-6 shadow-lg border border-white/10">
            <p className="text-blue-100 leading-relaxed text-[17px] md:text-2xl text-left">
              <span className="font-bold text-white">1.</span> Применяем передовые методики, но и делимся ими.
              Регулярно организуем обучающие мероприятия с участием ведущих специалистов страны
              в области подологии и медицины, чтобы обеспечивать высочайший стандарт услуг.
            </p>

            <p className="mt-6 text-blue-100 leading-relaxed text-[17px] md:text-2xl text-left">
              <span className="font-bold text-white">2.</span> Создали экосистему, где современные медицинские технологии
              встречаются с природной силой Японского моря.
            </p>
          </div>

          {/* Правая колонка */}
          <div className="rounded-3xl bg-[#1c3f8a] p-6 md:p-6 shadow-lg border border-white/10 text-left">
            <h3 className="text-2xl font-semibold mb-4">
              Почему выбирают именно нас?
            </h3>

            <ul className="space-y-4 text-blue-100 leading-relaxed text-[17px] md:text-lg">
              <li className="list-disc ml-5">
                <span className="font-semibold text-white">Комплексный подход:</span>
                <br />
                Подология, кинезиология и массаж работают в одной команде для вашего 100% результата.
              </li>

              <li className="list-disc ml-5">
                <span className="font-semibold text-white">Уникальные продукты:</span>
                <br />
                Индивидуальные ортопедические стельки с учётом анатомии вашей стопы.
                <br />
                Эффективные тейпы для поддержки мышц и суставов.
                <br />
                Эксклюзивная линейка питания на основе биоресурсов Японского моря
                для профилактики, восстановления и здоровья изнутри.
              </li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
};
