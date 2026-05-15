import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getAdminFlights, 
  getAdminTickets, 
  getCities, 
  createAdminFlight, 
  updateAdminFlight, 
  deleteAdminFlight 
} from '../api/client';

/**
 * AdminDashboardPage.jsx
 * 
 * Yönetim paneli. Uçuşları ve biletleri yönetmek için merkezi yerdir.
 * 
 * Önemli Mantıklar:
 * 1. Edit Mode: 'editingFlightId' doluysa form "Güncelle" modunda çalışır.
 * 2. Token Kontrolü: Her API isteğinde localStorage'daki token kullanılır.
 * 3. Tarih Dönüşümü: HTML 'datetime-local' inputu ile ISO string dönüşümü yapılır.
 */

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Data States
  const [flights, setFlights] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    from_city_id: '',
    to_city_id: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    seats_total: ''
  });
  const [editingFlightId, setEditingFlightId] = useState(null);

  // 1. Yetki Kontrolü ve Veri Yükleme
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchAllData();
  }, [token, navigate]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [flightsData, ticketsData, citiesData] = await Promise.all([
        getAdminFlights(token),
        getAdminTickets(token),
        getCities()
      ]);
      setFlights(flightsData);
      setTickets(ticketsData);
      setCities(citiesData);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Veriler yüklenirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // 2. Form İşlemleri (Ekleme / Güncelleme)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validations
    if (formData.from_city_id === formData.to_city_id) {
      setError('Kalkış ve varış şehri aynı olamaz.');
      return;
    }

    try {
      // Sayısal değerleri dönüştür
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        seats_total: parseInt(formData.seats_total),
        departure_time: new Date(formData.departure_time).toISOString(),
        arrival_time: new Date(formData.arrival_time).toISOString()
      };

      if (editingFlightId) {
        await updateAdminFlight(token, editingFlightId, payload);
      } else {
        await createAdminFlight(token, payload);
      }

      // Başarılıysa formu temizle ve listeyi yenile
      resetForm();
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'İşlem sırasında bir hata oluştu.');
    }
  };

  const handleEdit = (flight) => {
    setEditingFlightId(flight.flight_id);
    // Datetime-local formatına çevir (YYYY-MM-DDThh:mm)
    const depDate = new Date(flight.departure_time).toISOString().slice(0, 16);
    const arrDate = new Date(flight.arrival_time).toISOString().slice(0, 16);
    
    setFormData({
      from_city_id: flight.from_city_id,
      to_city_id: flight.to_city_id,
      departure_time: depDate,
      arrival_time: arrDate,
      price: flight.price,
      seats_total: flight.seats_total
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu uçuşu silmek istediğinize emin misiniz?')) return;
    
    try {
      await deleteAdminFlight(token, id);
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Silme işlemi başarısız.');
    }
  };

  const resetForm = () => {
    setEditingFlightId(null);
    setFormData({
      from_city_id: '',
      to_city_id: '',
      departure_time: '',
      arrival_time: '',
      price: '',
      seats_total: ''
    });
  };

  if (loading && flights.length === 0) return <div className="container"><p>Yükleniyor...</p></div>;

  return (
    <div className="admin-dashboard container">
      <header className="admin-header">
        <h1>Yönetim Paneli</h1>
        <div className="admin-actions">
          <Link to="/">Ana Sayfa</Link>
          <button onClick={handleLogout} className="btn-logout">Çıkış Yap</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {/* Uçuş Formu (Ekleme & Düzenleme) */}
      <section className="admin-section">
        <h3>{editingFlightId ? 'Uçuşu Güncelle' : 'Yeni Uçuş Ekle'}</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Kalkış Şehri:</label>
              <select required value={formData.from_city_id} onChange={(e) => setFormData({...formData, from_city_id: e.target.value})}>
                <option value="">Seçin</option>
                {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Varış Şehri:</label>
              <select required value={formData.to_city_id} onChange={(e) => setFormData({...formData, to_city_id: e.target.value})}>
                <option value="">Seçin</option>
                {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kalkış Zamanı:</label>
              <input type="datetime-local" required value={formData.departure_time} onChange={(e) => setFormData({...formData, departure_time: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Varış Zamanı:</label>
              <input type="datetime-local" required value={formData.arrival_time} onChange={(e) => setFormData({...formData, arrival_time: e.target.value})} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fiyat (TL):</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Toplam Koltuk:</label>
              <input type="number" required value={formData.seats_total} onChange={(e) => setFormData({...formData, seats_total: e.target.value})} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingFlightId ? 'Güncelle' : 'Uçuş Oluştur'}
            </button>
            {editingFlightId && <button type="button" onClick={resetForm} className="btn-secondary">İptal</button>}
          </div>
        </form>
      </section>

      {/* Uçuş Listesi */}
      <section className="admin-section">
        <h3>Tüm Uçuşlar</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rota</th>
                <th>Kalkış</th>
                <th>Fiyat</th>
                <th>Kapasite</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(f => (
                <tr key={f.flight_id}>
                  <td>{f.from_city.city_name} ➔ {f.to_city.city_name}</td>
                  <td>{new Date(f.departure_time).toLocaleString('tr-TR')}</td>
                  <td>{f.price} TL</td>
                  <td>{f.seats_available} / {f.seats_total}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(f)} className="btn-edit">Düzenle</button>
                    <button onClick={() => handleDelete(f.flight_id)} className="btn-delete">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bilet Listesi */}
      <section className="admin-section">
        <h3>Satılan Biletler</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Yolcu</th>
                <th>Uçuş</th>
                <th>Tarih</th>
                <th>Koltuk</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.ticket_id}>
                  <td>{t.passenger_name} {t.passenger_surname} <br/><small>{t.passenger_email}</small></td>
                  <td>{t.flight.from_city.city_name} ➔ {t.flight.to_city.city_name}</td>
                  <td>{new Date(t.flight.departure_time).toLocaleString('tr-TR')}</td>
                  <td>{t.seat_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
