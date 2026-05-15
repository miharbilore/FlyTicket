/**
 * services/adminService.js
 * 
 * Admin yetkisi gerektiren tüm veritabanı işlemleri (CRUD) burada yer alır.
 */

const prisma = require('../prisma/client');

/**
 * Yeni bir uçuş oluşturur. 
 * Zaman çakışması (Scheduling Conflict) kontrollerini yapar.
 */
const createFlight = async (flightData) => {
  const { from_city_id, to_city_id, departure_time, arrival_time, price, seats_total } = flightData;

  // 1. Şehirlerin varlığını kontrol et
  const fromCity = await prisma.city.findUnique({ where: { city_id: from_city_id } });
  const toCity = await prisma.city.findUnique({ where: { city_id: to_city_id } });

  if (!fromCity || !toCity) {
    throw new Error('CITY_NOT_FOUND');
  }

  // 2. Çakışma Kontrolü (Aynı şehirden aynı anda iki uçuş kalkamaz veya oraya varamaz)
  const departureConflict = await prisma.flight.findFirst({
    where: { from_city_id, departure_time: new Date(departure_time) }
  });
  if (departureConflict) throw new Error('DEPARTURE_CONFLICT');

  const arrivalConflict = await prisma.flight.findFirst({
    where: { to_city_id, arrival_time: new Date(arrival_time) }
  });
  if (arrivalConflict) throw new Error('ARRIVAL_CONFLICT');

  // 3. Uçuşu oluştur
  return await prisma.flight.create({
    data: {
      from_city_id,
      to_city_id,
      departure_time: new Date(departure_time),
      arrival_time: new Date(arrival_time),
      price,
      seats_total,
      seats_available: seats_total // Başlangıçta hepsi boş
    },
    include: {
      from_city: true,
      to_city: true
    }
  });
};

/**
 * Mevcut bir uçuşu günceller.
 */
const updateFlight = async (id, flightData) => {
  const { from_city_id, to_city_id, departure_time, arrival_time, price, seats_total } = flightData;

  // 1. Uçuş var mı?
  const existingFlight = await prisma.flight.findUnique({ 
    where: { flight_id: id },
    include: { _count: { select: { tickets: true } } }
  });
  if (!existingFlight) throw new Error('FLIGHT_NOT_FOUND');

  // 2. Çakışma Kontrolü (Kendisi hariç)
  if (departure_time) {
    const depConflict = await prisma.flight.findFirst({
      where: { 
        from_city_id: from_city_id || existingFlight.from_city_id, 
        departure_time: new Date(departure_time),
        NOT: { flight_id: id }
      }
    });
    if (depConflict) throw new Error('DEPARTURE_CONFLICT');
  }

  if (arrival_time) {
    const arrConflict = await prisma.flight.findFirst({
      where: { 
        to_city_id: to_city_id || existingFlight.to_city_id, 
        arrival_time: new Date(arrival_time),
        NOT: { flight_id: id }
      }
    });
    if (arrConflict) throw new Error('ARRIVAL_CONFLICT');
  }

  // 3. Koltuk sayısı güncelleme mantığı
  let newSeatsAvailable = existingFlight.seats_available;
  if (seats_total !== undefined) {
    const soldSeats = existingFlight.seats_total - existingFlight.seats_available;
    if (seats_total < soldSeats) {
      throw new Error('TOTAL_SEATS_TOO_LOW');
    }
    newSeatsAvailable = seats_total - soldSeats;
  }

  // 4. Güncelle
  return await prisma.flight.update({
    where: { flight_id: id },
    data: {
      from_city_id,
      to_city_id,
      departure_time: departure_time ? new Date(departure_time) : undefined,
      arrival_time: arrival_time ? new Date(arrival_time) : undefined,
      price,
      seats_total,
      seats_available: newSeatsAvailable
    },
    include: {
      from_city: true,
      to_city: true
    }
  });
};

/**
 * Uçuş siler. Bilet varsa silmeye izin vermez.
 */
const deleteFlight = async (id) => {
  const flight = await prisma.flight.findUnique({
    where: { flight_id: id },
    include: { _count: { select: { tickets: true } } }
  });

  if (!flight) throw new Error('FLIGHT_NOT_FOUND');
  if (flight._count.tickets > 0) throw new Error('FLIGHT_HAS_TICKETS');

  await prisma.flight.delete({ where: { flight_id: id } });
  return true;
};

/**
 * Sistemdeki tüm biletleri listeler.
 */
const getAllTickets = async () => {
  return await prisma.ticket.findMany({
    include: {
      flight: {
        include: {
          from_city: true,
          to_city: true
        }
      }
    },
    orderBy: {
      ticket_id: 'desc'
    }
  });
};

/**
 * Tüm uçuşları (kontenjan fark etmeksizin) listeler.
 */
const getAllFlights = async () => {
  return await prisma.flight.findMany({
    include: {
      from_city: true,
      to_city: true
    },
    orderBy: {
      departure_time: 'asc'
    }
  });
};

module.exports = {
  createFlight,
  updateFlight,
  deleteFlight,
  getAllTickets,
  getAllFlights
};
