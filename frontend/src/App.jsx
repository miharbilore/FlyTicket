import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/**
 * App.jsx
 * 
 * Uygulamanın ana bileşenidir. 
 * Sayfa yönlendirmeleri (Routing) burada yönetilir.
 */

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>FlyTicket</h1>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Diğer rotalar buraya eklenecek: /flights, /login, /admin vb. */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Geçici Ana Sayfa Bileşeni
const Home = () => {
  return (
    <div>
      <h2>Hoş Geldiniz!</h2>
      <p>FlyTicket ile biletinizi kolayca ayırtın.</p>
    </div>
  );
};

export default App;
