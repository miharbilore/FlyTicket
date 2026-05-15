/**
 * controllers/adminController.js
 * 
 * Admin işlemlerinin HTTP yönetimini yapar.
 */

const adminService = require('../services/adminService');

/**
 * Uçuş ekleme
 */
const createFlight = async (req, res) => {
  try {
    const { from_city_id, to_city_id, departure_time, arrival_time, price, seats_total } = req.body;

    // --- Validation ---
    if (!from_city_id || !to_city_id || !departure_time || !arrival_time || !price || !seats_total) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (from_city_id === to_city_id) {
      return res.status(400).json({ message: 'Departure and arrival cities cannot be the same.' });
    }
    if (new Date(arrival_time) <= new Date(departure_time)) {
      return res.status(400).json({ message: 'Arrival time must be after departure time.' });
    }

    const flight = await adminService.createFlight(req.body);
    res.status(201).json(flight);

  } catch (error) {
    console.error('adminCreateFlight error:', error);
    if (error.message === 'CITY_NOT_FOUND') return res.status(404).json({ message: 'One or both cities not found.' });
    if (error.message === 'DEPARTURE_CONFLICT') return res.status(400).json({ message: 'Another flight already departs from this city at the same time.' });
    if (error.message === 'ARRIVAL_CONFLICT') return res.status(400).json({ message: 'Another flight already arrives to this city at the same time.' });
    if (error.message === 'SAME_CITY') return res.status(400).json({ message: 'Departure and arrival cities cannot be the same.' });
    if (error.message === 'INVALID_TIME_RANGE') return res.status(400).json({ message: 'Arrival time must be after departure time.' });
    
    res.status(500).json({ message: 'Uçuş oluşturulurken bir hata oluştu.' });
  }
};

/**
 * Uçuş güncelleme
 */
const updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await adminService.updateFlight(id, req.body);
    res.json(flight);
  } catch (error) {
    console.error('adminUpdateFlight error:', error);
    if (error.message === 'FLIGHT_NOT_FOUND') return res.status(404).json({ message: 'Flight not found.' });
    if (error.message === 'CITY_NOT_FOUND') return res.status(404).json({ message: 'One or both cities not found.' });
    if (error.message === 'TOTAL_SEATS_TOO_LOW') return res.status(400).json({ message: 'Total seats cannot be less than already sold tickets.' });
    if (error.message === 'DEPARTURE_CONFLICT') return res.status(400).json({ message: 'Another flight already departs from this city at the same time.' });
    if (error.message === 'ARRIVAL_CONFLICT') return res.status(400).json({ message: 'Another flight already arrives to this city at the same time.' });
    if (error.message === 'SAME_CITY') return res.status(400).json({ message: 'Departure and arrival cities cannot be the same.' });
    if (error.message === 'INVALID_TIME_RANGE') return res.status(400).json({ message: 'Arrival time must be after departure time.' });
    if (error.message === 'INVALID_DATE') return res.status(400).json({ message: 'Please provide valid dates.' });
    if (error.message === 'INVALID_PRICE') return res.status(400).json({ message: 'Price must be a positive number.' });
    if (error.message === 'INVALID_SEATS') return res.status(400).json({ message: 'Seats total must be a positive number.' });
    
    res.status(500).json({ message: 'Uçuş güncellenirken bir hata oluştu.' });
  }
};

/**
 * Uçuş silme
 */
const deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    await adminService.deleteFlight(id);
    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('adminDeleteFlight error:', error);
    if (error.message === 'FLIGHT_NOT_FOUND') return res.status(404).json({ message: 'Flight not found.' });
    if (error.message === 'FLIGHT_HAS_TICKETS') return res.status(400).json({ message: 'Cannot delete a flight that already has tickets.' });
    
    res.status(500).json({ message: 'Uçuş silinirken bir hata oluştu.' });
  }
};

/**
 * Tüm biletleri listeleme
 */
const getAllTickets = async (req, res) => {
  try {
    const tickets = await adminService.getAllTickets();
    res.json(tickets);
  } catch (error) {
    console.error('adminGetAllTickets error:', error);
    res.status(500).json({ message: 'Biletler listelenirken bir hata oluştu.' });
  }
};

/**
 * Tüm uçuşları listeleme
 */
const getAllFlights = async (req, res) => {
  try {
    const flights = await adminService.getAllFlights();
    res.json(flights);
  } catch (error) {
    console.error('adminGetAllFlights error:', error);
    res.status(500).json({ message: 'Uçuşlar listelenirken bir hata oluştu.' });
  }
};

module.exports = {
  createFlight,
  updateFlight,
  deleteFlight,
  getAllTickets,
  getAllFlights
};
