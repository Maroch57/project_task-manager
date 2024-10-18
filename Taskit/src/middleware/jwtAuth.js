// src/middleware/jwtAuth.js
const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = decoded;
        next();
    });
};

// jwtAuth.js
module.exports = function (req, res, next) {
       console.log('JWT Auth Middleware');
       next();
     };
     