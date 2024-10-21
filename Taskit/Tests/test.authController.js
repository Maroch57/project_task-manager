// ./tests/test.authController.js

const request = require('supertest');
const app = require('../src/app'); // Replace with the path to your app's entry point (e.g., app.js or server.js)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let authToken = ''; // Variable to store token for authenticated requests

describe('Auth Controller', () => {
    beforeAll(async () => {
        // Clean up the database before running tests
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        // Clean up and close the Prisma client connection after tests
        await prisma.user.deleteMany();
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
        });

        it('should not log in with invalid credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'wrongpassword',
                });

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid credentials');
        });
    });

    describe('POST /logout', () => {
        it('should log out the user successfully', async () => {
            // Log in the user first
            const loginResponse = await request(app)
                .post('/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                });

            authToken = loginResponse.body.token; // Save the token for subsequent requests

            const response = await request(app)
                .post('/logout')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Logged out successfully');
        });

        it('should handle errors during logout', async () => {
            // Attempt to logout without a valid token
            const response = await request(app)
                .post('/logout')
                .set('Authorization', 'Bearer invalidtoken');

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty('message', 'Logout failed');
        });
    });
});
