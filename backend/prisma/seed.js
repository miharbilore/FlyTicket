/**
 * prisma/seed.js
 * 
 * Veritabanını başlangıç verileriyle (örnek şehirler, admin, uçuşlar) doldurmak için kullanılır.
 * Geliştirme aşamasında her seferinde manuel veri girmek yerine bu dosyayı çalıştırarak
 * tutarlı bir test verisi elde ederiz.
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- 🌱 Veritabanı Seed işlemi başladı ---');

  // 1. Mevcut verileri temizle (Sıralama önemli: önce biletler, sonra uçuşlar, sonra şehirler)
  // Bu işlem seed dosyasını tekrar tekrar çalıştırabilmemizi sağlar.
  await prisma.ticket.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.city.deleteMany();
  await prisma.admin.deleteMany();

  console.log('🧹 Eski veriler temizlendi.');

  // 2. Admin oluştur
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('👤 Admin kullanıcısı oluşturuldu: admin / admin123');

  // 3. 81 Türkiye Şehrini Ekle
  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 
    'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 
    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 
    'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 
    'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 
    'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 
    'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 
    'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
  ];

  // Şehirleri veritabanına ekle ve dönen objeleri bir array'de tut
  const createdCities = [];
  for (const name of cities) {
    const city = await prisma.city.create({
      data: { city_name: name },
    });
    createdCities.push(city);
  }
  console.log(`🏙️ ${createdCities.length} şehir başarıyla eklendi.`);

  // 4. Örnek Uçuşlar Ekle
  // Şehir listesinden rastgele seçimler yaparak 6 adet uçuş oluşturuyoruz.
  const istanbul = createdCities.find(c => c.city_name === 'İstanbul');
  const ankara = createdCities.find(c => c.city_name === 'Ankara');
  const izmir = createdCities.find(c => c.city_name === 'İzmir');
  const antalya = createdCities.find(c => c.city_name === 'Antalya');
  const trabzon = createdCities.find(c => c.city_name === 'Trabzon');

  const flightsData = [
    {
      from: istanbul.city_id,
      to: ankara.city_id,
      departure: new Date('2026-06-01T08:00:00Z'),
      arrival: new Date('2026-06-01T09:15:00Z'),
      price: 1250.00,
      seats: 120
    },
    {
      from: ankara.city_id,
      to: izmir.city_id,
      departure: new Date('2026-06-02T10:30:00Z'),
      arrival: new Date('2026-06-02T11:45:00Z'),
      price: 1100.00,
      seats: 100
    },
    {
      from: istanbul.city_id,
      to: antalya.city_id,
      departure: new Date('2026-06-03T14:00:00Z'),
      arrival: new Date('2026-06-03T15:30:00Z'),
      price: 1500.00,
      seats: 150
    },
    {
      from: trabzon.city_id,
      to: istanbul.city_id,
      departure: new Date('2026-06-04T09:00:00Z'),
      arrival: new Date('2026-06-04T10:45:00Z'),
      price: 1350.00,
      seats: 80
    },
    {
      from: izmir.city_id,
      to: antalya.city_id,
      departure: new Date('2026-06-05T18:00:00Z'),
      arrival: new Date('2026-06-05T19:15:00Z'),
      price: 950.00,
      seats: 90
    },
    {
      from: ankara.city_id,
      to: trabzon.city_id,
      departure: new Date('2026-06-06T07:30:00Z'),
      arrival: new Date('2026-06-06T08:45:00Z'),
      price: 1050.00,
      seats: 100
    }
  ];

  for (const f of flightsData) {
    await prisma.flight.create({
      data: {
        from_city_id: f.from,
        to_city_id: f.to,
        departure_time: f.departure,
        arrival_time: f.arrival,
        price: f.price,
        seats_total: f.seats,
        seats_available: f.seats, // Başlangıçta tüm koltuklar boş
      },
    });
  }

  console.log('✈️ 6 adet örnek uçuş başarıyla eklendi.');
  console.log('--- ✅ Seed işlemi başarıyla tamamlandı ---');
}

main()
  .catch((e) => {
    console.error('❌ Seed işlemi sırasında hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
