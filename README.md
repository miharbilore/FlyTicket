# FlyTicket - Uçak Bileti Rezervasyon Sistemi

FlyTicket, Node.js ve React kullanılarak geliştirilmiş, modern ve uçtan uca çalışan bir uçak bileti yönetim sistemidir. Bu proje, "Node.js Dynamic Web Programming" dersi final projesi olarak hazırlanmıştır.

## 🚀 Proje Hakkında

FlyTicket, kullanıcıların uçuş aramasına, detayları görmesine ve bilet satın almasına olanak tanırken; yöneticilerin (admin) uçuşları ve bilet satışlarını profesyonel bir panelden yönetmesini sağlar.

## ✨ Özellikler

### Kullanıcı Özellikleri
- **Gelişmiş Arama:** Kalkış, varış ve tarih bazlı uçuş arama.
- **Uçuş Listeleme:** Arama kriterlerine göre gerçek zamanlı uçuş sonuçları.
- **Detaylı İnceleme:** Uçuş saatleri, fiyat ve kalan koltuk sayısı görüntüleme.
- **Biletleme:** Hızlı ve güvenli bilet satın alma formu.
- **E-Bilet Onayı:** Satın alma sonrası PNR kodu ve bilet özeti.
- **Yazdırma Desteği:** Dijital bileti doğrudan tarayıcı üzerinden yazdırma.

### Admin Özellikleri
- **Güvenli Giriş:** JWT (JSON Web Token) tabanlı yetkilendirme.
- **Uçuş Yönetimi (CRUD):** Yeni uçuş ekleme, mevcut uçuşları güncelleme ve silme.
- **Çakışma Kontrolü:** Aynı şehirden aynı saatte birden fazla uçuş kalkmasını engelleyen akıllı zamanlama sistemi.
- **Koltuk Yönetimi:** Satılan biletlere göre otomatik azalan ve yönetilebilen kontenjan sistemi.
- **Bilet İzleme:** Sistemdeki tüm bilet satışlarını detaylı olarak listeleme.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React.js, Vite, React Router, Axios.
- **Backend:** Node.js, Express.js.
- **Veritabanı:** SQLite (Dosya tabanlı, kurulum gerektirmez).
- **ORM:** Prisma.
- **Güvenlik:** JWT (Kimlik Doğrulama), Bcrypt.js (Şifre Hashleme).
- **Stil:** Vanilla CSS (Modern Tasarım Prensipleri).

## 🗄️ Veritabanı Modelleri

- **City:** Şehir bilgileri (İsim ve ID).
- **Flight:** Uçuş bilgileri (Rota, Tarih, Fiyat, Kontenjan).
- **Ticket:** Bilet ve Yolcu bilgileri.
- **Admin:** Yönetici giriş bilgileri.

## ⚙️ Kurulum ve Çalıştırma

### 1. Backend Kurulumu
```bash
cd backend
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm start
```
*Backend adresi: http://localhost:5000*

### 2. Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```
*Frontend adresi: http://localhost:3000*

> **Önemli Not:** `GET /api/tickets/:email` endpointinde email URL içinde kullanılacağı için tarayıcı veya frontend tarafında encode edilmelidir. Örnek: `GET /api/tickets/test%40example.com`

### Admin Giriş Bilgileri
- **Kullanıcı Adı:** `admin`
- **Şifre:** `admin123`

## 📝 Önemli Notlar
- Proje, veri tutarlılığını sağlamak için veritabanı **Transaction** yapılarını kullanır.
- Tüm admin rotaları sunucu tarafında korunmaktadır.
- Projede harici bir UI kütüphanesi kullanılmamış, tüm stiller özgün CSS ile yazılmıştır.

## 📂 Klasör Yapısı
- `backend/src/services`: İş mantığı (Zaman çakışması, biletleme).
- `backend/src/controllers`: HTTP istek yönetimi.
- `frontend/src/pages`: Uygulama sayfaları.
- `frontend/src/api`: Merkezi API istemcisi.

---
*Bu proje akademik amaçlarla geliştirilmiştir.*
