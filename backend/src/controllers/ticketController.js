/**
 * controllers/ticketController.js
 * 
 * Bilet isteklerini yönetir ve gelen verileri doğrular.
 */

const ticketService = require('../services/ticketService');

/**
 * Bilet satın alma işlemi.
 */
const bookTicket = async (req, res) => {
  try {
    const { flight_id, passenger_name, passenger_surname, passenger_email, seat_number } = req.body;

    // --- Basit Validation (Doğrulama) ---
    if (!flight_id || !passenger_name || !passenger_surname || !passenger_email) {
      return res.status(400).json({ 
        message: 'Lütfen tüm zorunlu alanları doldurun (flight_id, passenger_name, passenger_surname, passenger_email).' 
      });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passenger_email)) {
      return res.status(400).json({ message: 'Lütfen geçerli bir e-posta adresi girin.' });
    }

    // Servis katmanını çağırarak işlemi gerçekleştir
    const ticket = await ticketService.createTicket({
      flight_id,
      passenger_name,
      passenger_surname,
      passenger_email,
      seat_number
    });

    res.status(201).json(ticket);

  } catch (error) {
    console.error('bookTicket error:', error);
    
    // Servis katmanından gelen özel hataları yakala
    if (error.message === 'FLIGHT_NOT_FOUND') {
      return res.status(404).json({ message: 'Uçuş bulunamadı.' });
    }
    if (error.message === 'NO_SEATS_AVAILABLE') {
      return res.status(400).json({ message: 'No available seats for this flight.' });
    }

    res.status(500).json({ message: 'Bilet oluşturulurken bir hata oluştu.' });
  }
};

/**
 * Email ile bilet sorgulama.
 */
const getMyTickets = async (req, res) => {
  try {
    const { email } = req.params;
    const tickets = await ticketService.getTicketsByEmail(email);
    res.json(tickets);
  } catch (error) {
    console.error('getMyTickets error:', error);
    res.status(500).json({ message: 'Biletler listelenirken bir hata oluştu.' });
  }
};

/**
 * Tek bilet detayı.
 */
const getTicketDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await ticketService.getTicketById(id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Bilet bulunamadı.' });
    }
    
    res.json(ticket);
  } catch (error) {
    console.error('getTicketDetail error:', error);
    res.status(500).json({ message: 'Bilet detayları alınırken bir hata oluştu.' });
  }
};

module.exports = {
  bookTicket,
  getMyTickets,
  getTicketDetail
};
