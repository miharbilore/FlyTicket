/**
 * app.js
 * 
 * Bu dosya Express uygulamasının ana yapılandırma merkezidir.
 * Middleware'ler (ara yazılımlar), rota tanımlamaları ve hata yakalama mekanizmaları burada kurulur.
 * Sunucuyu dinlemeye başlamaz, sadece uygulama nesnesini (app) dışa aktarır.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware (Ara Yazılımlar) ---

// CORS: Farklı kökenlerden (frontend gibi) gelen istekleri kabul etmek için
app.use(cors());

// express.json: Gelen isteklerdeki JSON gövdesini (body) okuyabilmek için
app.use(express.json());

// --- Rota Tanımlamaları ---

// Rota dosyalarını içeri aktarıyoruz
const cityRoutes = require('./routes/cityRoutes');
const flightRoutes = require('./routes/flightRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');

// Health Check: API'nin çalışıp çalışmadığını kontrol etmek için basit bir endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: "ok", 
    message: "FlyTicket API is running" 
  });
});

// API Rotalarını tanımlıyoruz
app.use('/api/cities', cityRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
