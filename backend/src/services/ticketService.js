/**
 * services/ticketService.js
 * 
 * Bilet işlemlerinin (oluşturma, sorgulama) yapıldığı servis katmanıdır.
 * Veritabanı tutarlılığı için 'Transaction' kullanımı burada yer alır.
 */

const prisma = require('../prisma/client');

/**
 * Yeni bir bilet oluşturur ve uçuşun kontenjanını günceller.
 * 
 * Önemli: Bu iki işlem tek bir '$transaction' içinde yapılır.
 * Eğer bilet oluşturulur ama uçuş kontenjanı düşürülemezse (veya tam tersi),
 * işlem geri alınır (rollback). Bu, veritabanı tutarlılığını korur.
 */
const createTicket = async (ticketData) => {
  const { flight_id, passenger_name, passenger_surname, passenger_email, seat_number } = ticketData;

  return await prisma.$transaction(async (tx) => {
    // 1. Uçuşu kontrol et (Locking / current state inside TX)
    const flight = await tx.flight.findUnique({
      where: { flight_id }
    });

    if (!flight) {
      throw new Error('FLIGHT_NOT_FOUND');
    }

    if (flight.seats_available <= 0) {
      throw new Error('NO_SEATS_AVAILABLE');
    }

    // 2. Koltuk numarası verilmemişse otomatik üret (Basit mantık)
    const currentTicketCount = await tx.ticket.count({ where: { flight_id } });
    const finalSeatNumber = seat_number || `AUTO-${currentTicketCount + 1}`;

    // 3. Conditional update ile kontenjanı düşür (Overbooking koruması)
    const updateResult = await tx.flight.updateMany({
      where: {
        flight_id,
        seats_available: { gt: 0 }
      },
      data: {
        seats_available: { decrement: 1 }
      }
    });

    if (updateResult.count === 0) {
      throw new Error('NO_SEATS_AVAILABLE');
    }

    // 4. Bilet oluştur
    const ticket = await tx.ticket.create({
      data: {
        flight_id,
        passenger_name,
        passenger_surname,
        passenger_email,
        seat_number: finalSeatNumber
      },
      include: {
        flight: {
          include: {
            from_city: true,
            to_city: true
          }
        }
      }
    });

    return ticket;
  });
};

/**
 * Email adresine göre kullanıcının tüm biletlerini getirir.
 */
const getTicketsByEmail = async (email) => {
  return await prisma.ticket.findMany({
    where: {
      passenger_email: email
    },
    include: {
      flight: {
        include: {
          from_city: true,
          to_city: true
        }
      }
    },
    orderBy: {
      ticket_id: 'desc'
    }
  });
};

/**
 * ID'ye göre bilet detayını getirir.
 */
const getTicketById = async (id) => {
  return await prisma.ticket.findUnique({
    where: {
      ticket_id: id
    },
    include: {
      flight: {
        include: {
          from_city: true,
          to_city: true
        }
      }
    }
  });
};

module.exports = {
  createTicket,
  getTicketsByEmail,
  getTicketById
};
