require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static folder for public files like CSS
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to database...');
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}...`);
        });
    })
    .catch((err) => { console.log(err); });
app.use(
    session({
        secret: 'yourSecretKey',  // Replace with a strong secret
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI, // Storing sessions in MongoDB
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day expiration
    })
);
// Routes
const restaurantRoutes = require('./routes/restaurantRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/', restaurantRoutes);
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/sign-in', (req, res) => {
    res.render('sign-in');
});
app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});


