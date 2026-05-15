import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Sayfa Bileşenleri
import HomePage from './pages/HomePage';
import FlightDetailPage from './pages/FlightDetailPage';
import ConfirmationPage from './pages/ConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * App.jsx
 * 
 * Uygulamanın ana giriş bileşenidir. 
 * React Router kullanarak sayfalar arası geçişi (navigation) burada tanımlıyoruz.
 * 
 * Routes:
 * - / : Ana sayfa (Uçuş arama)
 * - /flights/:id : Uçuş detayı ve bilet alma formu
 * - /confirmation/:ticketId : Satın alma sonrası onay sayfası
 * - * : Eşleşmeyen tüm adresler için 404 sayfası
 */

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigasyon Barı */}
        <header className="main-header">
          <div className="nav-container">
            <Link to="/" className="logo">
              <span className="logo-icon">✈️</span> FlyTicket
            </Link>
            <nav>
              <Link to="/">Uçuş Ara</Link>
              {/* İleride buraya 'Admin Girişi' eklenecek */}
            </nav>
          </div>
        </header>

        {/* Sayfa İçerikleri */}
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flights/:id" element={<FlightDetailPage />} />
            <Route path="/confirmation/:ticketId" element={<ConfirmationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="main-footer">
          <p>&copy; 2026 FlyTicket - Node.js Final Projesi</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
