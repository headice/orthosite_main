import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/privacy-policy') {
    return null;
  }

  return (
    <footer className="w-full bg-[#020b1a] text-gray-300 py-10 px-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-8 text-sm">
        <div className="flex flex-col gap-3 justify-self-start text-left">
          <Link to="/requisites"><p>Реквизиты</p></Link>
          <Link to="/catalog?type=services"><p>Услуги</p></Link>
          <Link to="/catalog?type=products"><p>Товары</p></Link>
        </div>

        <div className="flex flex-col items-center text-center gap-3 justify-self-center">
          <p className="text-base font-semibold">ЛОГО</p>
          <p className="text-xs">© 2022–2026 Все права защищены</p>
        </div>

        <div className="flex flex-col gap-3 justify-self-end text-right">
          <Link to="/profile"><p>Профиль</p></Link>
          <Link to="/privacy-policy"><p>Политика обработки персональных данных</p></Link>
          <a><p>Пользовательское соглашение / Договор оферты</p></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
