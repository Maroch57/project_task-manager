// ./tests/test.auth.js

const request = require('supertest');
const app = require('../src/app'); // Adjust the path to your app's entry point (e.g., app.js or server.js)
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
let authToken = ''; // Variable to store JWT token for authenticated requests

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        // Clean up the database before running tests
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        // Close the Prisma client connection after tests
        await prisma.$disconnect();
    });

    describe('POST /signup', () => {
        it('should sign up a new user', async () => {
            const response = await request(app)
                .post('/signup')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                });
            
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully');
            expect(response.body.user).toHaveProperty('email', 'testuser@example.com');
        });

        it('should not sign up an existing user', async () => {
            const response = await request(app)
                .post('/signup')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                });

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /login', () => {
        it('should log in a user with valid credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Logged in successfully');
            expect(response.body).toHaveProperty('user');
            authToken = response.body.token; // Store JWT token for further testing
        });

        it('should not log in with invalid credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'wrongpassword',
                });

            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid credentials');
        });
    });

    describe('GET /user/:id', () => {
        it('should get user details with a valid token', async () => {
            const user = await prisma.user.findFirst({ where: { email: 'testuser@example.com' } });
            const response = await request(app)
                .get(`/user/${user.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('email', 'testuser@example.com');
        });

        it('should not get user details with an invalid token', async () => {
            const user = await prisma.user.findFirst({ where: { email: 'testuser@example.com' } });
            const response = await request(app)
                .get(`/user/${user.id}`)
                .set('Authorization', 'Bearer invalidtoken');

            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid token.');
        });
    });

    describe('POST /logout', () => {
        it('should log out the user and invalidate the token', async () => {
            const response = await request(app)
                .post('/logout')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Logged out successfully');

            // Attempt to access a protected route with the invalidated token
            const user = await prisma.user.findFirst({ where: { email: 'testuser@example.com' } });
            const userResponse = await request(app)
                .get(`/user/${user.id}`)
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(userResponse.statusCode).toBe(401);
            expect(userResponse.body).toHaveProperty('message', 'Token has been invalidated. Please log in again.');
        });
    });
});
