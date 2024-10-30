//app.js
const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes');
const cors = require('cors');
require('dotenv').config();
//addition
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(cors());
app.use(express.json());
app.use('/', routes);

//addition
app.get('/', (req, res) => {
       res.sendFile(path.join(__dirname, '../frontend/index.html'));
     });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
