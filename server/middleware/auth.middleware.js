const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.yukti_session;
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required. No session cookie found.' });
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret_for_development'
    );
    
    // Attach validated Google user metadata to the request for downstream controllers
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid or expired session token presented', { error: error.message });
    res.clearCookie('yukti_session');
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }
};

module.exports = {
  requireAuth
};
