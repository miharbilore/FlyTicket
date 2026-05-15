# FlyTicket - Proje Savunma ve Açıklama Notları

Bu dosya, projeyi hocaya sunarken ve savunurken sana rehberlik etmesi için hazırlanmıştır.

## A. Proje Akış Özeti

1.  **Kullanıcı Akışı:**
    *   Kullanıcı ana sayfada kalkış şehri, varış şehri ve tarih seçerek uçuş arar.
    *   Uçuşlar listelendiğinde "Detayları Gör" butonuyla uçuşun özel sayfasına gider.
    *   Yolcu bilgilerini girerek bilet satın alır. Bu işlem backend'de bir veritabanı işlemi (Transaction) olarak gerçekleşir.
    *   Başarılı işlem sonrası bir PNR (Bilet ID) kodu alır ve bilet çıktısını görebilir.

2.  **Admin Akışı:**
    *   Admin `/admin/login` sayfasından giriş yapar.
    *   Giriş başarılıysa tarayıcıya bir JWT (JSON Web Token) kaydedilir.
    *   Admin Panelinde uçuşları listeler, yeni uçuş ekler, mevcut uçuşları günceller veya siler.
    *   Ayrıca sistemdeki tüm bilet satışlarını tek bir tabloda görebilir.

---

## B. Önemli Dosyalar ve Görevleri

### Backend (Node.js + Express + Prisma)
*   `backend/src/server.js`: Sunucunun başladığı giriş noktasıdır. Portu dinler.
*   `backend/src/app.js`: Express yapılandırması, middleware'ler ve ana rotaların (route) bağlandığı yerdir.
*   `backend/prisma/schema.prisma`: Veritabanı şemasıdır. Tablolar ve aralarındaki ilişkiler burada tanımlanır.
*   `backend/prisma/seed.js`: Veritabanına başlangıç verilerini (81 şehir ve örnek uçuşlar) yükleyen araçtır.
*   `backend/src/prisma/client.js`: Prisma ORM ile veritabanına bağlanmamızı sağlayan merkezi nesnedir.
*   `backend/src/services/...`: İş mantığının (Business Logic) olduğu yerdir. Uçuş çakışma kontrolleri, koltuk azaltma gibi işlemler burada yapılır.
*   `backend/src/middleware/authMiddleware.js`: Admin sayfalarına giden isteklerin yetkili olup olmadığını (Token kontrolü) kontrol eder.

### Frontend (React + Vite)
*   `frontend/src/App.jsx`: Uygulamanın navigasyon ve yönlendirme (Routing) merkezidir.
*   `frontend/src/api/client.js`: Backend API ile konuşan merkezi axios istemcisidir.
*   `frontend/src/pages/HomePage.jsx`: Arama ve uçuş listeleme sayfası.
*   `frontend/src/pages/AdminDashboardPage.jsx`: Admin yönetim merkezi.

---

## C. "Kod Bozulursa" Müdahale Rehberi

1.  **Backend çalışmıyorsa:** `cd backend` -> `npm run dev` komutunu kontrol et. Hata mesajında "PORT" yazıyorsa 5000 portunu başka bir uygulama kullanıyor olabilir.
2.  **Database / Prisma Hatası:** `npx prisma generate` ve ardından `npx prisma migrate dev` komutlarını çalıştırarak şemayı tazeleyebilirsin.
3.  **Bilet Alırken Hata:** `flightService.js` ve `ticketService.js` dosyalarını kontrol et. Koltuk kalmamış olabilir veya veritabanı bağlantısı kopmuş olabilir.
4.  **Admin Girişi Çalışmıyorsa:** `.env` dosyasındaki `JWT_SECRET` değerinin ve `seed.js` içindeki admin şifresinin doğruluğunu kontrol et.
5.  **Frontend API'ye Bağlanamıyorsa:** `frontend/src/api/client.js` içindeki `API_BASE_URL` adresinin backend adresiyle (http://localhost:5000/api) aynı olduğundan emin ol.

---

## D. Olası Hoca Soruları ve Cevapları

**S: Neden Node.js + Express kullandın?**
**C:** JavaScript ekosisteminde çok popüler olduğu için. Node.js asenkron yapısıyla hızlıdır ve Express, backend API kurmak için en hafif ve esnek framework'lerden biridir.

**S: Prisma ne işe yarıyor? Neden doğrudan SQL yazmadın?**
**C:** Prisma bir ORM'dir (Object-Relational Mapping). SQL sorgularını JavaScript objeleri üzerinden yazmamızı sağlar. Hata yapma riskini azaltır, kodu daha okunabilir kılar ve veritabanı değişimlerinde (örn. SQLite'tan PostgreSQL'e) kodu bozmadan geçiş yapmayı kolaylaştırır.

**S: JWT (JSON Web Token) nedir? Neden kullandın?**
**C:** Stateless (durumsuz) bir kimlik doğrulama yöntemidir. Sunucunun her istekte "Bu kullanıcı kim?" diye veritabanına bakmasına gerek kalmaz. Token içindeki imzayı kontrol ederek güvenli bir şekilde kimlik doğrular.

**S: Transaction neden kullandın?**
**C:** Bilet alma işlemi kritik bir işlemdir. Bilet oluşturulurken aynı zamanda uçağın `seats_available` (boş koltuk) sayısının azaltılması gerekir. Bunu bir Transaction içinde yapıyoruz. Ayrıca, eşzamanlı (concurrency) bilet alımlarında "overbooking" olmaması için backend'de "conditional update" (koltuk sayısı > 0 ise azalt) mantığını kullanıyoruz. Eğer bilet oluşur ama koltuk kalmazsa veya işlem yarıda kalırsa, Transaction sayesinde tüm adımlar geri alınır ve veri tutarlılığı korunur.

**S: Uçuş çakışma kurallarını nerede kontrol ediyorsun?**
**C:** `adminService.js` içinde kontrol ediyorum. Veritabanına yeni bir uçuş eklenmeden önce, aynı saatte o şehirden başka bir uçuş kalkıp kalkmadığına bakıyorum.

**S: Parolaları neden bcrypt ile hashledin?**
**C:** Güvenlik için. Veritabanı ele geçirilse bile kötü niyetli kişiler parolaların açık halini göremez. Şifreler sadece "karma" (hash) halleriyle saklanır.
