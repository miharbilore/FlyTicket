import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Sayfa Bileşenleri
import HomePage from './pages/HomePage';
import FlightDetailPage from './pages/FlightDetailPage';
import ConfirmationPage from './pages/ConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

/**
 * App.jsx
 * 
 * Uygulamanın ana giriş bileşenidir. 
 * React Router kullanarak sayfalar arası geçişi (navigation) burada tanımlıyoruz.
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
              <Link to="/admin/login">Admin Paneli</Link>
            </nav>
          </div>
        </header>

        {/* Sayfa İçerikleri */}
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flights/:id" element={<FlightDetailPage />} />
            <Route path="/confirmation/:ticketId" element={<ConfirmationPage />} />
            
            {/* Admin Rotaları */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

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
