/**
 * services/flightService.js
 * 
 * Uçuşlarla ilgili veritabanı sorgularını içerir.
 */

const prisma = require('../prisma/client');

/**
 * Filtreleme seçeneklerine göre uçuşları arar.
 */
const searchFlights = async (filters) => {
  const { from_city_id, to_city_id, date } = filters;

  // Sorgu koşullarını oluşturuyoruz
  const where = {
    seats_available: {
      gt: 0 // Sadece boş koltuğu olan uçuşlar
    }
  };

  if (from_city_id) {
    where.from_city_id = from_city_id;
  }

  if (to_city_id) {
    where.to_city_id = to_city_id;
  }

  // Eğer tarih verilmişse, o günün başı ve sonu arasındaki uçuşları buluyoruz.
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    where.departure_time = {
      gte: startOfDay,
      lte: endOfDay
    };
  }

  return await prisma.flight.findMany({
    where,
    include: {
      from_city: true,
      to_city: true
    },
    orderBy: {
      departure_time: 'asc'
    }
  });
};

/**
 * ID'ye göre tek bir uçuş getirir.
 */
const getFlightById = async (id) => {
  return await prisma.flight.findUnique({
    where: { flight_id: id },
    include: {
      from_city: true,
      to_city: true
    }
  });
};

module.exports = {
  searchFlights,
  getFlightById
};
