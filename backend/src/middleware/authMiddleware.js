/**
 * middleware/authMiddleware.js
 * 
 * Bu ara yazılım (middleware), korumalı rotalara gelen isteklerin 
 * geçerli bir JWT token'ına sahip olup olmadığını kontrol eder.
 */

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Header içinde Authorization: Bearer TOKEN formatında mı kontrol et
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token'ı "Bearer <token>" string'inden ayırıyoruz
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token geçerliyse, içindeki admin bilgisini 'req.admin' içine koyuyoruz.
      // Bu sayede sonraki fonksiyonlar (controller) kimin işlem yaptığını bilir.
      req.admin = decoded;

      // Bir sonraki adıma geç (Controller'a)
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Token hiç gönderilmediyse
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
