/**
 * controllers/authController.js
 * 
 * Login isteklerini karşılayan kontrolcü.
 */

const authService = require('../services/authService');

/**
 * Giriş yapma fonksiyonu.
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basit alan kontrolü
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required.' 
      });
    }

    // Servisi çağır
    const result = await authService.loginAdmin(username, password);

    res.json({
      message: "Login successful",
      ...result
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Hatalı giriş durumunda 401 Unauthorized dönüyoruz
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ 
        message: 'Invalid username or password' 
      });
    }

    res.status(500).json({ message: 'Giriş yapılırken bir hata oluştu.' });
  }
};

module.exports = {
  login
};
