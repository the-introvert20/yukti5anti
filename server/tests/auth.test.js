const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

// Mock out the OAuth library completely
jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        getToken: jest.fn().mockResolvedValue({
          tokens: { id_token: 'mocked_id_token' }
        }),
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: () => ({
            sub: '1010101010101010',
            email: 'testexplorer@ledger.edu.in',
            name: 'Test Explorer',
            picture: 'https://example.com/pic.jpg'
          })
        })
      };
    })
  };
});

describe('Authentication API & OAuth 2.0 PKCE', () => {
  
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret_key';
    process.env.NODE_ENV = 'test';
  });

  describe('POST /api/auth/google', () => {
    
    it('Should reject requests missing an authorization code', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({}); // missing code

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('Should negotiate tokens and establish a session when valid code is provided', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({ code: 'valid_mock_authorization_code_from_frontend' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('testexplorer@ledger.edu.in');

      // Assert that HTTP-Only cookie was issued
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/yukti_session=/);
      expect(cookies[0]).toMatch(/HttpOnly/);
    });
  });

  describe('Auth Middleware (requireAuth)', () => {
    
    it('Should return 401 when trying to access /api/auth/profile without a session cookie', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.statusCode).toEqual(401);
    });

    it('Should allow access to /api/auth/profile when valid session cookie exists', async () => {
      // 1. Generate valid JWT offline
      const validToken = jwt.sign(
        { id: '101', email: 'testexplorer@ledger.edu.in' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // 2. Mock sending it in cookie
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Cookie', `yukti_session=${validToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.user.email).toBe('testexplorer@ledger.edu.in');
    });

    it('Should reject access if the token is forged or invalid (simulate expired)', async () => {
      const invalidToken = 'ey.invalid.signature';
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Cookie', `yukti_session=${invalidToken}`);

      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('Should successfully clear the session cookie', async () => {
      const res = await request(app).post('/api/auth/logout');
      
      expect(res.statusCode).toEqual(200);
      
      // Look for Set-Cookie header that expires the cookie
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/yukti_session=;/);
    });
  });

});
