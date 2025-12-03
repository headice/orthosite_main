import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    // Если мы на странице политики — не показываем футер
    if (location.pathname === "/privacy-policy") {
        return null;
    }
    return (
        <footer className="w-full bg-[#020b1a] text-gray-300 py-10 px-4 sm:px-6">
            <div className="
        mx-auto max-w-6xl
        grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]
        items-start
        gap-8 md:gap-12
        text-sm
        text-center md:text-left
      ">
                {/* левая колонка */}
                <div className="flex flex-col gap-3 justify-self-start text-left md:text-left text-center md:justify-self-start">
                    <a><p>Компания</p></a>
                    <a><p>ИНН</p></a>
                    <a><p>ОГРН</p></a>
                </div>

                {/* центр */}
                <div className="flex flex-col items-center text-center gap-3 justify-self-center mt-8 md:mt-0">
                    <p className="text-base font-semibold">ЛОГО</p>
                    <p className="text-xs">© 2022–2025 Все права защищены</p>
                </div>

                {/* правая колонка */}
                <div className="flex flex-col gap-3 justify-self-end text-right md:text-right text-center md:mt-0 mt-8">
                    <Link to="/privacy-policy">
                        <p>Политика обработки персональных данных</p>
                    </Link>

                    <a><p>Пользовательское соглашение / Договор оферты</p></a>
                </div>
            </div>
        </footer>
    );
};
export default Footer;