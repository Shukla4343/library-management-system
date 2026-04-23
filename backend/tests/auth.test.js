const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  test('POST /api/auth/register - should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'test123',
        role: 'user'
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('accessToken');
  });

  test('POST /api/auth/login - should login user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'test123'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('accessToken');
  });
});