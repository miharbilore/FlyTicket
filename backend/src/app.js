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

// Health Check: API'nin çalışıp çalışmadığını kontrol etmek için basit bir endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: "ok", 
    message: "FlyTicket API is running" 
  });
});

// Henüz detaylı rotalar eklenmedi (Uçuşlar, Biletler, vb.)

module.exports = app;
