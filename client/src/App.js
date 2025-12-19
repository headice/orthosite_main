import React, { useEffect } from 'react';
import './App.css';
import { Home } from './Home';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Politika from './Politika';
import Footer from "./components/Footer.jsx";
import { PaymentSuccess } from "./PaymentSuccess";

// Компонент, который живёт внутри Router и отправляет хиты при смене маршрута
function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.ym && typeof window.ym === 'function') {
      window.ym(105921891, 'hit', location.pathname);
    }
  }, [location.pathname]);

  return null; // ничего не рендерим
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Трекинг переходов */}
        <RouteChangeTracker />

        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Home />} />

          {/* Политика обработки персональных данных */}
          <Route path="/privacy-policy" element={<Politika />} />

          {/* Спасибо за покупку */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>

        {/* Футер будет на всех страницах */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
