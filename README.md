# FlyTicket - Uçak Bileti Rezervasyon Sistemi

Bu proje, Node.js Dynamic Web Programming dersi final projesi olarak geliştirilmektedir. Modern full-stack web teknolojileri kullanılarak basit ve anlaşılır bir uçak bileti yönetim sistemi hedeflenmektedir.

## 🚀 Teknolojiler

- **Backend:** Node.js, Express, Prisma ORM
- **Database:** SQLite
- **Frontend:** React (Vite), React Router, Axios
- **Styling:** Vanilla CSS

## 🛠️ Kurulum ve Çalıştırma

### 1. Backend Hazırlığı
```bash
cd backend
npm install
# .env dosyasını kontrol edin
# Prisma istemcisini oluşturun
npx prisma generate
npm run dev
```

### 2. Frontend Hazırlığı
```bash
cd frontend
npm install
npm run dev
```

## 📍 API Endpoint'leri
- `GET /api/health`: Sistemin çalışma durumunu kontrol eder.

## 📅 Development Roadmap

- [x] Proje iskeletinin oluşturulması
- [ ] Veritabanı modellerinin (Flight, Ticket, User) tasarlanması
- [ ] Backend CRUD işlemlerinin yazılması (Uçuş ekleme, bilet alma)
- [ ] Admin paneli ve JWT tabanlı giriş sistemi
- [ ] Frontend arayüzünün geliştirilmesi (Arama, Liste, Satın Alma)
- [ ] Final cilalama ve sunum hazırlığı

---
*Bu proje eğitim amaçlıdır.*
