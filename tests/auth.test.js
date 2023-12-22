const request = require('supertest');
const express = require('express');
const router = require('../controller/UserController');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Authentication API Tests', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ userid: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userid', 'testuser');
  });

  it('should log in a user and return a token', async () => {
    const response = await request(app)
      .post('/login')
      .send({ userid: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
