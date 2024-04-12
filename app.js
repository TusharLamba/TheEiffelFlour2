const express = require('express');
const cookieParser = require('cookie-parser');
const { logger } = require('./middleware/logHandler');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const usersRoute = require('./routes/users');
const productRoute =  require('./routes/products');
const verifyJWT = require('./middleware/verifyJWT');
require('dotenv').config();
const PORT = process.env.PORT || 3500

const app = express();

// serverlogs
app.use(logger);

// CROSS Origin Resource Sharing
app.use(cors());

// json + form data parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// parsing cookies
app.use(cookieParser());

app.use('/user', usersRoute);

// we verify JWT before we start giving access to other routes & resources in app
app.use(verifyJWT);

app.use('/product', productRoute);


// main error Handler
app.use(errorHandler);

// listen at the PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));