const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage' // Critical for Google Identity Services popup codebase
);

// Exchange Auth Code for Tokens and establish Session
const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      logger.warn('Google login failed: Missing authorization code in request body');
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Secure token exchange via PKCE flow using the Google Auth Library
    const { tokens } = await client.getToken(code);
    
    // Verify the ID Token natively
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    logger.info(`Successful Google Auth for user: ${payload.email} (${payload.sub})`);

    // Create our own backend session token (JWT)
    const sessionToken = jwt.sign(
      { 
        id: payload.sub, 
        email: payload.email, 
        name: payload.name, 
        picture: payload.picture 
      },
      process.env.JWT_SECRET || 'fallback_secret_for_development',
      { expiresIn: '24h' }
    );

    // Issue HTTP-Only, Secure cookie
    res.cookie('yukti_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Enforce HTTPS in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      success: true,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });

  } catch (error) {
    logger.error('Token exchange/verification failed', { error: error.message });
    res.status(401).json({ error: 'Invalid Google token or authorization code' });
  }
};

const logout = (req, res) => {
  res.clearCookie('yukti_session');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Check if current session is still valid
const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.status(200).json({ user: req.user });
};

module.exports = {
  googleLogin,
  logout,
  getProfile
};
