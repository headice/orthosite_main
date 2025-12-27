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
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="flex flex-col gap-1 text-sm text-center lg:text-left">
            <p>ИП Михайдарова Наталья Владимировна</p>
            <p className="mt-1">ИНН 250200007709</p>
            <p>ОГРН 317253600064398</p>
          </div>

          {/* ЦЕНТР */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 6132.53 9800.18"
                width="48"
                height="78"
                className="fill-white"
              >
                <style>{`
                  .fil1 { fill: #FF8E16; }
                  .fil0 { fill: white; fill-rule: nonzero; }
                `}</style>

                <g>
                  <path
                    className="fil0"
                    d="M3728.68 4914c434.82..."
                  />
                  <path
                    className="fil1"
                    d="M1737.84 4307.86c0,0..."
                  />
                </g>
              </svg>
            </div>

            <p className="text-xs sm:text-[13px] text-gray-300">
              © 2025 Все права защищены
            </p>
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className="flex flex-col items-center lg:items-end text-sm gap-3">
            <Link
              to="/privacy-policy"
              className="underline underline-offset-4 hover:text-white transition-colors text-center lg:text-right"
            >
              Политика обработки
              <br className="hidden sm:block" />
              персональных данных
            </Link>

            <button
              type="button"
              className="underline underline-offset-4 hover:text-white transition-colors text-center lg:text-right"
            >
              Пользовательское соглашение /
              <br className="hidden sm:block" />
              Договор оферты
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
