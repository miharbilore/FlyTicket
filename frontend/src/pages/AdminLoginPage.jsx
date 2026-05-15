import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '../api/client';

/**
 * AdminLoginPage.jsx
 * 
 * Yönetici girişi sayfası.
 * Başarılı girişte backend'den dönen JWT token localStorage'a kaydedilir.
 */

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginAdmin(formData);
      
      // Token'ı yerel depolamaya (localStorage) kaydet
      localStorage.setItem('adminToken', data.token);
      
      // Dashboard'a yönlendir
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page container">
      <div className="login-card">
        <h2>Yönetici Girişi</h2>
        <p className="hint">Öğretici Not: Varsayılan admin bilgileri: <b>admin</b> / <b>admin123</b></p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Kullanıcı Adı:</label>
            <input 
              type="text" 
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Şifre:</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/">Ana Sayfaya Dön</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
