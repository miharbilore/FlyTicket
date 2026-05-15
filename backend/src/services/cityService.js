/**
 * services/cityService.js
 * 
 * Servis katmanı, veritabanı işlemlerinin (Prisma) yapıldığı yerdir.
 * Controller katmanından gelen isteklere göre veritabanı sorgularını çalıştırır.
 */

const prisma = require('../prisma/client');

/**
 * Tüm şehirleri alfabetik sırayla getirir.
 */
const getAllCities = async () => {
  return await prisma.city.findMany({
    orderBy: {
      city_name: 'asc'
    }
  });
};

module.exports = {
  getAllCities
};
