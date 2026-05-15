/**
 * controllers/flightController.js
 * 
 * Uçuş isteklerini yönetir.
 */

const flightService = require('../services/flightService');

/**
 * Uçuşları listeler ve filtreler.
 */
const getFlights = async (req, res) => {
  try {
    const { from_city_id, to_city_id, date } = req.query;
    
    const flights = await flightService.searchFlights({ 
      from_city_id, 
      to_city_id, 
      date 
    });
    
    res.json(flights);
  } catch (error) {
    console.error('getFlights error:', error);
    res.status(500).json({ 
      message: 'Uçuşlar listelenirken bir hata oluştu.' 
    });
  }
};

/**
 * Tek bir uçuşun detayını getirir.
 */
const getFlightById = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await flightService.getFlightById(id);
    
    if (!flight) {
      return res.status(404).json({ message: 'Uçuş bulunamadı.' });
    }
    
    res.json(flight);
  } catch (error) {
    console.error('getFlightById error:', error);
    res.status(500).json({ 
      message: 'Uçuş detayları alınırken bir hata oluştu.' 
    });
  }
};

module.exports = {
  getFlights,
  getFlightById
};
