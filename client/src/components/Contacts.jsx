import React from "react";
import tips from "../components/img/prikl.png";
import qr from "../components/img/qr-code.png";
import Tg from "../components/img/tetega.png";

export const Contacts = () => {
  return (
    <section id="contacts" className="scroll-mt-20">
      <div className="grid md:grid-cols-4 gap-6 items-end animate-fadeUp">

        {/* ЛЕВАЯ КОЛОНКА (контакты) - ТОЛЬКО текст уменьшаем */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-6">КОНТАКТЫ</h2>

          <div className="w-full max-w-xs">
            <p className="text-blue-100 font-semibold text-sm md:text-xs lg:text-base">Адрес:</p>
            <p className="text-blue-100 text-sm md:text-xs lg:text-base">Владивосток, </p>
            <p className="mb-4 text-blue-100 text-sm md:text-xs lg:text-base"></p>

            <p className="text-blue-100 font-semibold text-sm md:text-xs lg:text-base">Контакты:</p>
            <p className="mb-4">
              <a href="tel:+79644452449" className="text-blue-100 hover:text-white transition-colors text-sm md:text-xs lg:text-base">
                +79644452449
              </a>
            </p>
            <p className="text-blue-100 font-semibold text-sm md:text-xs lg:text-base">Задать вопрос:</p>
            <p className="mb-4">
              <a href="mailto:vectorzdorovya@yandex.ru" className="text-blue-100 hover:text-white transition-colors text-sm md:text-xs lg:text-base">
                vectorzdorovya@yandex.ru
              </a>
            </p>
            <p className="text-blue-100 font-semibold mb-3 text-sm md:text-xs lg:text-base">Соцсети :</p>

            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://t.me/+x9U2vQkJ5M1mOTIy" target="_blank" rel="noopener noreferrer">
                <img
                  src={Tg}
                  alt="Telegram"
                  className="w-14 h-14 sm:w-12 sm:h-12 md:w-12 md:h-12 hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>

        {/* ЦЕНТРАЛЬНЫЙ БЛОК - КАРТИНКУ НЕ ТРОГАЕМ, только карту уменьшаем */}
        <div className="md:col-span-2 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center">
                <img
                  src={tips}
                  alt="Изображение"
                  className="w-50 h-35" // НЕ МЕНЯЕМ
                />
              </div>
            </div>
          </div>

          {/* КАРТА — уменьшаем высоту для планшетов */}
          <div
            className="
              w-full h-64 md:h-60 lg:h-72 
              rounded-3xl overflow-hidden 
              border-[3px] border-[#3ba7ff]
              shadow-[0_0_20px_rgba(59,167,255,0.3)]
              mt-4
            "
          >
            <iframe
              title="map"
              width="100%"
              height="100%"
              loading="lazy"
              style={{ border: "none" }}
              className="rounded-3xl"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d186242.85735465912!2d131.95345799999998!3d43.166587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5fb39cba5249d485%3A0x186704d4dd967e35!2z0JLQu9Cw0LTQuNCy0L7RgdGC0L7Quiwg0J_RgNC40LzQvtGA0YHQutC40Lkg0LrRgNCw0Lk!5e0!3m2!1sru!2sru!4v1770125973260!5m2!1sru!2sru"
            ></iframe>
          </div>
        </div>

        {/* ПРАВЫЙ QR-КОД - не трогаем */}
        <div className="md:col-span-1 flex justify-center md:justify-end items-end">
          <img
            src={qr}
            alt="QR"
            className="w-60 md:w-72 opacity-100"
          />
        </div>

      </div>
    </section>
  );
};
