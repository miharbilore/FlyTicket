/**
 * controllers/cityController.js
 * 
 * Controller katmanı, HTTP isteklerini karşılar ve yanıtları (Response) yönetir.
 * İş mantığı için servis katmanını çağırır.
 */

const cityService = require('../services/cityService');

/**
 * Tüm şehirleri listeler.
 */
const getCities = async (req, res) => {
  try {
    const cities = await cityService.getAllCities();
    res.json(cities);
  } catch (error) {
    console.error('getCities error:', error);
    res.status(500).json({ 
      message: 'Şehirler listelenirken bir hata oluştu.' 
    });
  }
};

module.exports = {
  getCities
};
