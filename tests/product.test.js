const request = require('supertest');
const express = require('express');
const userRouter = require('../controller/UserController');
const productRouter = require('../controller/ProductController');

const app = express();
app.use(express.json());
app.use('/', userRouter)
app.use('/', productRouter);

describe('Product API Tests', () => {
    let productId = 1;
    let token;

    it('should log in a user and return a token', async () => {
        const response = await request(app)
            .post('/login')
            .send({ userid: 'testuser', password: 'testpassword' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
    });
    console.log(token);

    // Test the get all products route
    it('should get all products', async () => {
        const response = await request(app)
            .get('/all')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');;
        expect(response.status).toBe(200);
    });


    // Test the create product route
    it('should create a new product', async () => {
        const response = await request(app)
            .post('/create')
            .send({ name: 'Test Product', description: 'Test Description', price: 19.99 })
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Test Product');
        expect(response.body).toHaveProperty('description', 'Test Description');
        expect(response.body).toHaveProperty('price', 19.99);
    });

    console.log(productId);

    // Test the get product by ID route
    it('should get a product by ID', async () => {
        const response = await request(app)
            .get(`/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect([response.body]).toHaveLength(1);
    });

    // Test the update product route
    it('should update a product', async () => {
        const response = await request(app)
            .put(`/update/${productId}`)
            .send({ name: 'Updated Product', description: 'Updated Description', price: 29.99 })
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('name', 'Updated Product')
        expect(response.body).toHaveProperty('description', 'Updated Description');
        expect(response.body).toHaveProperty('price', 29.99);
    });

    // Test the delete product route
    it('should delete a product', async () => {
        const response = await request(app)
            .delete(`/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');;
        expect(response.status).toBe(200);
    });
});
