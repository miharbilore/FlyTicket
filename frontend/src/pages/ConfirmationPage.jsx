import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketDetail } from '../api/client';

/**
 * ConfirmationPage.jsx
 * 
 * Bilet satın alma işlemi bittikten sonra bilet detaylarını gösteren "Biletiniz Hazır" sayfası.
 */

const ConfirmationPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const data = await getTicketDetail(ticketId);
      setTicket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="container"><p>Bilet bilgileriniz getiriliyor...</p></div>;
  if (!ticket) return <div className="container"><p>Bilet bulunamadı.</p></div>;

  return (
    <div className="confirmation-page container">
      <div className="success-banner">
        <span className="icon">✅</span>
        <h2>Biletiniz Başarıyla Oluşturuldu!</h2>
        <p>İyi uçuşlar dileriz.</p>
      </div>

      <div className="ticket-view">
        <div className="ticket-header">
          <h3>E-BİLET</h3>
          <span className="ticket-id">Pnr: {ticket.ticket_id.toUpperCase()}</span>
        </div>

        <div className="ticket-body">
          <div className="passenger-info">
            <h4>Yolcu Bilgileri</h4>
            <p><strong>İsim:</strong> {ticket.passenger_name} {ticket.passenger_surname}</p>
            <p><strong>E-posta:</strong> {ticket.passenger_email}</p>
            <p><strong>Koltuk:</strong> {ticket.seat_number}</p>
          </div>

          <div className="flight-info-detail">
            <h4>Uçuş Bilgileri</h4>
            <p><strong>Nereden:</strong> {ticket.flight.from_city.city_name}</p>
            <p><strong>Nereye:</strong> {ticket.flight.to_city.city_name}</p>
            <p><strong>Kalkış:</strong> {new Date(ticket.flight.departure_time).toLocaleString('tr-TR')}</p>
            <p><strong>Fiyat:</strong> {ticket.flight.price} TL</p>
          </div>
        </div>

        <div className="ticket-footer">
          <button onClick={handlePrint} className="btn-print">Bileti İndir / Yazdır</button>
          <Link to="/" className="btn-home">Ana Sayfaya Dön</Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .btn-print, .btn-home, header, .success-banner {
            display: none;
          }
          .ticket-view {
            border: 2px solid #333;
            padding: 20px;
          }
        }
      `}} />
    </div>
  );
};

export default ConfirmationPage;
