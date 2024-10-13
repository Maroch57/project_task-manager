const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Your User model
const bcrypt = require('bcryptjs');

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id); // Adjust this if using Prisma
    done(null, user);
});

// Local Strategy for email/password login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email }); // Adjust this if using Prisma
        if (!user) {
            return done(null, false, { message: 'No user found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Google Strategy for Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback', // Adjust as necessary
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ googleId: profile.id }); // Adjust this if using Prisma
        if (existingUser) {
            return done(null, existingUser);
        }

        // If not, create a new user
        const newUser = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value, // Get email from Google profile
            // Add additional fields if necessary
        });
        done(null, newUser);
    } catch (error) {
        done(error);
    }
}));
