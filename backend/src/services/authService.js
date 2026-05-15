/**
 * services/authService.js
 * 
 * Kimlik doğrulama işlemlerinin (Login, Token üretimi) yapıldığı yerdir.
 */

const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Admin girişi yapar ve başarılıysa JWT token üretir.
 */
const loginAdmin = async (username, password) => {
  // 1. Kullanıcıyı veritabanında bul (Seed içinde 'admin' kullanıcısı eklemiştik)
  const admin = await prisma.admin.findUnique({
    where: { username }
  });

  // Kullanıcı yoksa hata fırlat
  if (!admin) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // 2. Şifreyi doğrula
  // Veritabanındaki şifre bcrypt ile hashlenmiş olduğu için compare kullanıyoruz.
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  
  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // 3. JWT Token Üret
  // Token payload'una sadece gerekli minimal bilgileri koyuyoruz.
  const token = jwt.sign(
    { 
      admin_id: admin.id, 
      username: admin.username 
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' } // Token 2 saat sonra geçersiz kalacak
  );

  return {
    token,
    admin: {
      admin_id: admin.id,
      username: admin.username
    }
  };
};

module.exports = {
  loginAdmin
};
