const request = require('supertest');
const app = require('../app');  // โหลดแอปพลิเคชัน

describe('🔥 Products API Test Suite', () => {

    const productId = 1;
    const nonExistId = 9999;

    // GET /products
    describe('🔍 GET /products', () => {
        it('should fetch all products', async () => {
            const { statusCode, body } = await request(app).get('/products');
            expect(statusCode).toBe(200);
            expect(Array.isArray(body)).toBe(true);  // ตรวจสอบว่าผลลัพธ์เป็น Array
        });
    });

    // GET /products/:id
    describe('🆔 GET /products/:id', () => {
        it('should get product by ID', async () => {
            const { statusCode, body } = await request(app).get(`/products/${productId}`);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject({ id: productId });
        });

        it('should return 404 if product not found', async () => {
            const { statusCode } = await request(app).get(`/products/${nonExistId}`);
            expect(statusCode).toBe(404);
        });
    });

    // POST /products
    describe('➕ POST /products', () => {
        it('should add new product', async () => {
            const newItem = { name: 'Tablet', price: 300 };
            const { statusCode, body } = await request(app).post('/products').send(newItem);
            expect(statusCode).toBe(201);
            expect(body).toMatchObject({ name: 'Tablet' });
        });

        it('should return 201 if product data is invalid', async () => {
            const { statusCode, body } = await request(app).post('/products').send({});
            expect(statusCode).toBe(201);
            expect(body).toHaveProperty('id');
        });
    });

    // PUT /products/:id
    describe('🛠️ PUT /products/:id', () => {
        it('should update existing product', async () => {
            const updatedItem = { name: 'Updated Laptop', price: 1500 };
            const { statusCode, body } = await request(app).put(`/products/${productId}`).send(updatedItem);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject(updatedItem);
        });

        it('should return 200 if update data is invalid', async () => {
            const { statusCode } = await request(app).put(`/products/${productId}`).send({});
            expect(statusCode).toBe(200);
        });

        it('should return 404 if product not found', async () => {
            const { statusCode } = await request(app).put(`/products/${nonExistId}`).send({ name: 'Test' });
            expect(statusCode).toBe(404);
        });
    });

    // DELETE /products/:id
    describe('🗑️ DELETE /products/:id', () => {
        it('should delete a product', async () => {
            const { statusCode } = await request(app).delete(`/products/${productId}`);
            expect(statusCode).toBe(200);
        });

        it('should return 404 if product not found', async () => {
            const { statusCode } = await request(app).delete(`/products/${nonExistId}`);
            expect(statusCode).toBe(404);
        });
    });

    // Invalid Routes
    describe('🚫 Invalid Routes', () => {
        it('should return 404 for unknown GET route', async () => {
            const { statusCode, text } = await request(app).get('/invalid-route');
            expect(statusCode).toBe(404);
            expect(text).toContain('Cannot GET /invalid-route');
        });

        it('should return 404 for unknown POST route', async () => {
            const { statusCode, text } = await request(app).post('/another-invalid-route');
            expect(statusCode).toBe(404);
            expect(text).toContain('Cannot POST /another-invalid-route');
        });
    });

});
