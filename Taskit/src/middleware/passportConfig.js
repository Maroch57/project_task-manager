const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwtAuth = require('./jwtAuth.js')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* passport.use(new GoogleStrategy({
       clientID: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: 'http://localhost:3000/auth/google/callback'
   },
   function(accessToken, refreshToken, profile, done) {
       // Handle user profile here
       return done(null, profile);
       
   }));
*/
// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});

// Local Strategy for email/password login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
       // Use Prisma client to find the user
       const user = await prisma.user.findUnique({
              where: { email }, // Prisma way to query by email
          });
  
          if (!user) {
              return done(null, false, { message: 'No user found' });
          }
  
          // Compare passwords
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return done(null, false, { message: 'Incorrect password' });
          }
  
          // If everything is good, return the user
          return done(null, user);
      } catch (error) {
          return done(error);
      }
}));
/*
// Google Strategy for Google OAuth
passport.use(new GoogleStrategy({
       clientID: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: process.env.GOOGLE_CALLBACK_URL, // Adjust as necessary as defined in the .env dir
   }, async (accessToken, refreshToken, profile, done) => {
       try {
           // Check if user already exists
           const existingUser = await prisma.user.findUnique({ where: { googleId: profile.id } });
   
           if (existingUser) {
               return done(null, existingUser); // If user exists, return them
           }
   
           // If not, create a new user
           const newUser = await prisma.user.create({
               data: {
                   googleId: profile.id, // Store the Google ID
                   email: profile.emails[0].value, // Get email from Google profile
                   
                   // Add additional fields if necessary
               },
           });
           return done(null, newUser); // Return the newly created user
           
       } catch (error) {
           return done(error); // Pass the error to the done callback
       }
   })); 
 */