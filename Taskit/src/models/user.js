// ./src/models/User.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// User model functions

// Create a new user
const createUser = async (email, password) => {
    return await prisma.user.create({
        data: {
            email,
            password,
        },
    });
};

// Find a user by email
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
};

// Additional functions can be added as needed

module.exports = {
    createUser,
    findUserByEmail,
};
