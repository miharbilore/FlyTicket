import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCities, getFlights } from '../api/client';

/**
 * HomePage.jsx
 * 
 * Uygulamanın ana sayfasıdır. Şehir seçimi ve uçuş arama işlemleri burada yapılır.
 * 
 * State Kullanımı:
 * - cities: Dropdown'ları doldurmak için backend'den gelen şehir listesi.
 * - flights: Arama sonucu listelenen uçuşlar.
 * - filters: Kullanıcının seçtiği arama kriterleri.
 * - loading/error: API isteklerinin durumunu takip etmek için.
 */

const HomePage = () => {
  const [cities, setCities] = useState([]);
  const [flights, setFlights] = useState([]);
  const [filters, setFilters] = useState({
    from_city_id: '',
    to_city_id: '',
    date: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sayfa ilk açıldığında şehirleri ve tüm uçuşları yükle
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [citiesData, flightsData] = await Promise.all([
        getCities(),
        getFlights()
      ]);
      setCities(citiesData);
      setFlights(flightsData);
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Arama butonu tıklandığında
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    // Basit frontend doğrulaması
    if (filters.from_city_id && filters.to_city_id && filters.from_city_id === filters.to_city_id) {
      setError('Kalkış ve varış şehri aynı olamaz.');
      return;
    }

    try {
      setLoading(true);
      const data = await getFlights(filters);
      setFlights(data);
    } catch (err) {
      setError('Uçuşlar aranırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Filtreleri temizle
  const handleReset = () => {
    setFilters({ from_city_id: '', to_city_id: '', date: '' });
    fetchInitialData();
  };

  return (
    <div className="home-page">
      <section className="hero">
        <h1>FlyTicket</h1>
        <p>Hızlı ve kolayca uçuşunu bul, biletini ayırt.</p>
      </section>

      {/* Arama Formu */}
      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>Nereden:</label>
            <select 
              value={filters.from_city_id} 
              onChange={(e) => setFilters({...filters, from_city_id: e.target.value})}
            >
              <option value="">Şehir Seçin</option>
              {cities.map(city => (
                <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Nereye:</label>
            <select 
              value={filters.to_city_id} 
              onChange={(e) => setFilters({...filters, to_city_id: e.target.value})}
            >
              <option value="">Şehir Seçin</option>
              {cities.map(city => (
                <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tarih:</label>
            <input 
              type="date" 
              value={filters.date} 
              onChange={(e) => setFilters({...filters, date: e.target.value})}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">Uçuş Ara</button>
            <button type="button" onClick={handleReset} className="btn-secondary">Sıfırla</button>
          </div>
        </form>
      </section>

      {error && <div className="error-message">{error}</div>}

      {/* Uçuş Listesi */}
      <section className="results-section">
        <h2>Uçuş Sonuçları</h2>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : flights.length > 0 ? (
          <div className="flight-grid">
            {flights.map(flight => (
              <div key={flight.flight_id} className="flight-card">
                <div className="flight-header">
                  <span>{flight.from_city.city_name}</span>
                  <span className="arrow">✈️</span>
                  <span>{flight.to_city.city_name}</span>
                </div>
                <div className="flight-info">
                  <p><strong>Kalkış:</strong> {new Date(flight.departure_time).toLocaleString('tr-TR')}</p>
                  <p><strong>Varış:</strong> {new Date(flight.arrival_time).toLocaleString('tr-TR')}</p>
                  <p className="price">{flight.price} TL</p>
                  <p className="seats">Müsait Koltuk: {flight.seats_available}</p>
                </div>
                <Link to={`/flights/${flight.flight_id}`} className="btn-book">
                  Detayları Gör / Satın Al
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">Aradığınız kriterlere uygun uçuş bulunamadı.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
