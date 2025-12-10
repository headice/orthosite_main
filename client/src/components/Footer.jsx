import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // На странице политики персональных данных футер не показываем
  if (location.pathname === "/privacy-policy") {
    return null;
  }

  return (
    <footer className="w-full bg-[#020b1a] text-gray-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div
          className="
            flex flex-col items-center text-center gap-6
            lg:grid lg:grid-cols-[1.2fr_auto_1.2fr] lg:items-start lg:gap-12
          "
        >
          {/* ЛЕВАЯ КОЛОНКА – ИП / ИНН / ОГРН */}
          <div className="flex flex-col gap-1 text-sm text-center lg:text-left">
            <p>ИП Михайдарова Наталья Владимировна</p>
            <p className="mt-1">ИНН 250200007709</p>
            <p>ОГРН 317253600064398</p>
          </div>

          {/* ЦЕНТР – ЛОГОТИП + КОПИРАЙТ */}
          <div className="flex flex-col items-center text-center gap-2">
            {/* Сюда подставь свой логотип (SVG/PNG) */}
            {/* <img src={footerLogo} alt="Логотип" className="h-12 w-auto" /> */}
            <div className="h-12 flex items-center justify-center">
              {/* Временный текст вместо лого, чтобы ничего не ломалось */}
              <span className="text-lg font-semibold tracking-wide">ЛОГО</span>
            </div>

            <p className="text-xs sm:text-[13px] text-gray-300">
              ©2025 Все права защищены
            </p>
          </div>

          {/* ПРАВАЯ КОЛОНКА – ССЫЛКИ + РАЗРАБОТЧИКИ */}
          <div className="flex flex-col items-center lg:items-end text-sm gap-3">
            <div className="flex flex-col items-center lg:items-end gap-2 leading-snug">
              <Link
                to="/privacy-policy"
                className="underline underline-offset-4 hover:text-white transition-colors text-center lg:text-right"
              >
                Политика обработки<br className="hidden sm:block" />
                персональных данных
              </Link>

              <button
                type="button"
                className="underline underline-offset-4 hover:text-white transition-colors text-center lg:text-right"
              >
                Пользовательское соглашение /<br className="hidden sm:block" />
                Договор оферты
              </button>
            </div>

           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
