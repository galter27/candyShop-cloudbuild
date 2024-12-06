require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session');

// Routes
const productsRoutes = require('./routes/productsRoutes.js');
const loginRoutes = require('./routes/loginRoutes.js');
const logoutRoutes = require('./routes/logoutRoutes.js')
const registerRoutes = require('./routes/registerRoutes.js');
const adminRoute = require('./routes/adminRoute.js');
const nearMeRoutes = require('./routes/nearMeRoutes');
const cartRoutes = require('./routes/cartRoutes');
const searchRoutes = require('./routes/searchRoute.js');

// Create session
app.use(
  session({
    secret: "wusha",
    resave: false,
    saveUninitialized: false,
  })
);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/candyShop')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));;
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Set up views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/logout', logoutRoutes);
app.use('/products', productsRoutes);
app.use('/register', registerRoutes);
app.use('/personal',adminRoute);
app.use('/nearMe', nearMeRoutes)
app.use('/', loginRoutes);
app.use('/cart', cartRoutes);
app.use('/search', searchRoutes); 

// Render 404
app.use((req, res) => {
  res.status(404).render('404'); // Renders the 404 view
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});

//test