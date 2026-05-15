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
    where: { flight_id: id }
  });
  if (!existingFlight) throw new Error('FLIGHT_NOT_FOUND');

  // 2. Final değerleri belirle (request body yoksa mevcut değeri kullan)
  const finalFromCityId = from_city_id || existingFlight.from_city_id;
  const finalToCityId = to_city_id || existingFlight.to_city_id;
  const finalDepartureTime = departure_time ? new Date(departure_time) : new Date(existingFlight.departure_time);
  const finalArrivalTime = arrival_time ? new Date(arrival_time) : new Date(existingFlight.arrival_time);
  const finalPrice = price !== undefined ? price : existingFlight.price;
  const finalSeatsTotal = seats_total !== undefined ? seats_total : existingFlight.seats_total;

  // 3. Temel Validation
  if (finalFromCityId === finalToCityId) throw new Error('SAME_CITY');
  if (isNaN(finalDepartureTime.getTime()) || isNaN(finalArrivalTime.getTime())) throw new Error('INVALID_DATE');
  if (finalArrivalTime <= finalDepartureTime) throw new Error('INVALID_TIME_RANGE');
  if (finalPrice < 0) throw new Error('INVALID_PRICE');
  if (finalSeatsTotal <= 0) throw new Error('INVALID_SEATS');

  // 4. Şehirlerin varlığını kontrol et (Değiştiyse)
  if (from_city_id || to_city_id) {
    const fromCity = await prisma.city.findUnique({ where: { city_id: finalFromCityId } });
    const toCity = await prisma.city.findUnique({ where: { city_id: finalToCityId } });
    if (!fromCity || !toCity) throw new Error('CITY_NOT_FOUND');
  }

  // 5. Çakışma Kontrolü (Kendisi hariç)
  const depConflict = await prisma.flight.findFirst({
    where: { 
      from_city_id: finalFromCityId, 
      departure_time: finalDepartureTime,
      NOT: { flight_id: id }
    }
  });
  if (depConflict) throw new Error('DEPARTURE_CONFLICT');

  const arrConflict = await prisma.flight.findFirst({
    where: { 
      to_city_id: finalToCityId, 
      arrival_time: finalArrivalTime,
      NOT: { flight_id: id }
    }
  });
  if (arrConflict) throw new Error('ARRIVAL_CONFLICT');

  // 6. Koltuk sayısı güncelleme mantığı
  let newSeatsAvailable = existingFlight.seats_available;
  if (seats_total !== undefined) {
    const soldSeats = existingFlight.seats_total - existingFlight.seats_available;
    if (seats_total < soldSeats) {
      throw new Error('TOTAL_SEATS_TOO_LOW');
    }
    newSeatsAvailable = seats_total - soldSeats;
  }

  // 7. Güncelle
  return await prisma.flight.update({
    where: { flight_id: id },
    data: {
      from_city_id: finalFromCityId,
      to_city_id: finalToCityId,
      departure_time: finalDepartureTime,
      arrival_time: finalArrivalTime,
      price: finalPrice,
      seats_total: finalSeatsTotal,
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
