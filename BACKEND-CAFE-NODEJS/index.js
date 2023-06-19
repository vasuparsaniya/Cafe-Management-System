const express = require('express');
var cors = require('cors');     //cross-origin resource sharing
const path = require('path');

const connection = require('./connection');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const billRoute = require('./routes/bill');
const dashboardRoute = require('./routes/dashboard');
const app = express();

const frontendPath = path.join(__dirname, '../frontend/dist/Frontend');
app.use(express.static(frontendPath));

// app.use(cors());
app.use(cors({
    origin: 'https://cafe-management-system.onrender.com', // Specify the allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  }));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://cafe-management-system.onrender.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
  

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user',userRoute);  // when ever user API run /user is goto userRoute
app.use('/category',categoryRoute);  // when ever category API run /category is go to categoryRoute
app.use('/product',productRoute);
app.use('/bill',billRoute);
app.use('/dashboard',dashboardRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;