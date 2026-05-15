import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage.jsx
 * 
 * Kullanıcı tanımlanmamış bir URL'ye girdiğinde gösterilen 404 sayfası.
 */

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>404</h1>
      <p>Aradığınız sayfa bulunamadı.</p>
      <Link to="/" className="btn-primary">Ana Sayfaya Dön</Link>
    </div>
  );
};

export default NotFoundPage;
