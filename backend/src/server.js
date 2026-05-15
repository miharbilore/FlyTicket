/**
 * server.js
 * 
 * Uygulamanın giriş noktasıdır (Entry Point).
 * app.js'de yapılandırdığımız Express uygulamasını alır ve belirli bir port üzerinden dinlemeye başlar.
 * Bu ayrım (app vs server), test yaparken kolaylık sağlar.
 */

const app = require('./app');

// Port numarasını .env dosyasından alıyoruz, yoksa varsayılan olarak 5000 kullanıyoruz.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`-----------------------------------------------`);
  console.log(`🚀 FlyTicket Backend sunucusu hazır!`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 Sağlık Kontrolü: http://localhost:${PORT}/api/health`);
  console.log(`-----------------------------------------------`);
});
