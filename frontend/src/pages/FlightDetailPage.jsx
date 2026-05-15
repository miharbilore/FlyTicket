import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFlightById, createTicket } from '../api/client';

/**
 * FlightDetailPage.jsx
 * 
 * Belirli bir uçuşun detaylarını gösterir ve bilet alma formunu sunar.
 * 
 * useParams: URL'deki :id parametresini okumak için kullanılır.
 * useNavigate: Bilet alımı başarılı olduktan sonra kullanıcıyı yönlendirmek için kullanılır.
 */

const FlightDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    passenger_name: '',
    passenger_surname: '',
    passenger_email: '',
    seat_number: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFlight();
  }, [id]);

  const fetchFlight = async () => {
    try {
      const data = await getFlightById(id);
      setFlight(data);
    } catch (err) {
      setError('Uçuş bilgileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // API'ye bilet oluşturma isteği gönder
      const ticket = await createTicket({
        flight_id: id,
        ...formData
      });

      // Başarılıysa onay sayfasına yönlendir
      navigate(`/confirmation/${ticket.ticket_id}`);
    } catch (err) {
      // Backend'den gelen hata mesajını göster
      setError(err.response?.data?.message || 'Bilet alınırken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><p>Yükleniyor...</p></div>;
  if (!flight) return <div className="container"><p>Uçuş bulunamadı.</p></div>;

  return (
    <div className="detail-page container">
      <div className="flight-summary">
        <h2>Uçuş Detayı</h2>
        <div className="summary-card">
          <p><strong>Rota:</strong> {flight.from_city.city_name} ➔ {flight.to_city.city_name}</p>
          <p><strong>Kalkış:</strong> {new Date(flight.departure_time).toLocaleString('tr-TR')}</p>
          <p><strong>Varış:</strong> {new Date(flight.arrival_time).toLocaleString('tr-TR')}</p>
          <p><strong>Fiyat:</strong> {flight.price} TL</p>
          <p><strong>Müsait Koltuk:</strong> {flight.seats_available}</p>
        </div>
      </div>

      <div className="booking-form-section">
        <h3>Yolcu Bilgileri</h3>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-group">
            <label>Adınız:</label>
            <input 
              type="text" 
              required
              value={formData.passenger_name}
              onChange={(e) => setFormData({...formData, passenger_name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Soyadınız:</label>
            <input 
              type="text" 
              required
              value={formData.passenger_surname}
              onChange={(e) => setFormData({...formData, passenger_surname: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>E-posta Adresiniz:</label>
            <input 
              type="email" 
              required
              value={formData.passenger_email}
              onChange={(e) => setFormData({...formData, passenger_email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Koltuk Numarası (Opsiyonel):</label>
            <input 
              type="text" 
              placeholder="Örn: 12A"
              value={formData.seat_number}
              onChange={(e) => setFormData({...formData, seat_number: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-confirm" disabled={submitting}>
            {submitting ? 'İşleniyor...' : 'Bileti Onayla ve Satın Al'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlightDetailPage;
