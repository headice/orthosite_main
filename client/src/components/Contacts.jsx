import React from "react";
import tips from "../components/img/prikl.png";
import qr from "../components/img/qr-code.png";
//import VK from "../components/img/VK.png";
//import Wat from "../components/img/Wats.png";
import Tg from "../components/img/tetega.png";

export const Contacts = () => {
  return (
    <section id="contacts" className="scroll-mt-20 px-2 sm:px-0">
      <div className="grid md:grid-cols-4 gap-6 items-end animate-fadeUp">

        {/* ЛЕВАЯ КОЛОНКА (контакты) */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">КОНТАКТЫ</h2>

          <div className="w-full max-w-xs">
            <p className="text-blue-100 font-semibold">Адрес:</p>
            <p className="mb-4 text-blue-100">Новосибирск, ул. Шамшурина, 37</p>

            <p className="text-blue-100 font-semibold">Контакты:</p>
            <p className="mb-4">
              <a href="tel:+79991234567" className="text-blue-100 hover:text-white transition-colors">
                +7 964 446-24-49
              </a>
            </p>
            <p className="text-blue-100 font-semibold">Задать вопрос:</p>
            <p className="mb-4">
              <a href="tel:+79991234567" className="text-blue-100 hover:text-white transition-colors">
               vectorzdorovya@yandex.ru
              </a>
            </p>
            <p className="text-blue-100 font-semibold mb-3">Соцсети :</p>

            <div className="flex justify-center md:justify-start gap-4">
 

  {/* Telegram */}
  <a href="https://t.me/+x9U2vQkJ5M1mOTIy" target="_blank" rel="noopener noreferrer">
    <img
      src={Tg}
      alt="Telegram"
      className="w-10 h-10 md:w-10 md:h-10 hover:opacity-80 transition-opacity"
    />
  </a>
</div>
          </div>
        </div>

        {/* ЦЕНТРАЛЬНЫЙ БЛОК */}
        <div className="md:col-span-2 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center">
                <img
                  src={tips}
                  alt="Изображение"
                  className="w-50 h-35"
                />
              </div>
            </div>
          </div>

          {/* КАРТА — обновлённая версия */}
          <div
            className="
              w-full h-64 md:h-72 
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d146489.12199891082!2d82.87878995012974!3d54.9925182038434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x42dfe5e190cc4d97%3A0x9b3a0673e1d3e985!2z0J3QvtCy0L7RgdC40LHQuNGA0YHQuiwg0J3QvtCy0L7RgdC40LHQuNGA0YHQutCw0Y8g0L7QsdC7Liwg0KDQvtGB0YHQuNGP!5e0!3m2!1sru!2snl!4v1764488081649!5m2!1sru!2snl"
            ></iframe>
          </div>
        </div>

        {/* ПРАВЫЙ QR-КОД */}
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
