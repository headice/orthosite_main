import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Home } from './Home';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Politika from './Politika';
import  Footer  from "./components/Footer.jsx"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Home />} />

          {/* Политика обработки персональных данных */}
          <Route path="/privacy-policy" element={<Politika />} />
        </Routes>

        {/* Футер будет на всех страницах */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
