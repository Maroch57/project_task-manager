// ./tests/test.userController.js

const request = require('supertest');
const app = require('../src/app'); // Replace with the path to your app's entry point (e.g., app.js or server.js)
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

let authToken = ''; // Variable to store token for authenticated requests
let userId = '';

describe('User Controller', () => {
    beforeAll(async () => {
        // Clean up and create a test user
        await prisma.user.deleteMany();

        const passwordHash = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
            data: {
                email: 'testuser@example.com',
                password: passwordHash,
            },
        });

        userId = user.id;

        // Simulate login to get a token for authenticated requests
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        authToken = loginResponse.body.token; // Assuming the login route returns a JWT token
    });

    afterAll(async () => {
        // Clean up and close the Prisma client connection after tests
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    describe('GET /profile', () => {
        it('should get the user profile', async () => {
            const response = await request(app)
                .get('/profile')
                .set('Authorization', `Bearer ${authToken}`); // Send the token for authentication

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', 'testuser@example.com');
        });

        it('should return 404 if the user is not found', async () => {
            // Temporarily delete the user for this test
            await prisma.user.delete({ where: { id: userId } });

            const response = await request(app)
                .get('/profile')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('message', 'User not found');

            // Restore the user for other tests
            await prisma.user.create({
                data: {
                    id: userId,
                    email: 'testuser@example.com',
                    password: await bcrypt.hash('password123', 10),
                },
            });
        });
    });

    describe('PUT /profile', () => {
        it('should update the user profile', async () => {
            const response = await request(app)
                .put('/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    email: 'updateduser@example.com',
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Profile updated successfully');

            // Verify the email was updated
            const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
            expect(updatedUser.email).toBe('updateduser@example.com');
        });

        it('should update the user password', async () => {
            const response = await request(app)
                .put('/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    password: 'newpassword123',
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Profile updated successfully');

            // Verify the password was updated
            const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
            const isPasswordMatch = await bcrypt.compare('newpassword123', updatedUser.password);
            expect(isPasswordMatch).toBe(true);
        });

        it('should return 404 if the user is not found during update', async () => {
            // Temporarily delete the user for this test
            await prisma.user.delete({ where: { id: userId } });

            const response = await request(app)
                .put('/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    email: 'nonexistent@example.com',
                });

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('message', 'User not found');

            // Restore the user for other tests
            await prisma.user.create({
                data: {
                    id: userId,
                    email: 'testuser@example.com',
                    password: await bcrypt.hash('password123', 10),
                },
            });
        });
    });
});
