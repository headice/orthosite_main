import React from 'react';
import './App.css';
import { Home } from './Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Politika from './Politika';
import Footer from './components/Footer.jsx';
import { RequisitesPage } from './pages/RequisitesPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="App bg-[#030b1f] min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<Politika />} />
          <Route path="/requisites" element={<RequisitesPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
