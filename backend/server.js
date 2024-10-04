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
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/', restaurantRoutes);
app.use('/', authRoutes);
app.use('/api/bookings', orderRoutes);
app.use('/', dashboardRoutes);

app.get('/', (req, res) => {
    res.redirect('/home');
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
app.get('/sign-in', (req, res) => {
    res.render('sign-in');
});
app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});
/*
const Package = require('./models/packageModel');


// Assuming you have a restaurant ID
const restaurantId = "66fed71a671caa92c5f07841"; // Example ID

const newPackage = new Package({
    name: 'VIP Catering Package',
    price: 500,
    description: 'Includes premium dishes, drinks, and exclusive service.',
    image: 'https://example.com/vip-package.jpg', // Optional image
    restaurant: restaurantId
});

newPackage.save()
    .then(() => {
        console.log('Package saved successfully.');
    })
    .catch(err => {
        console.error('Error saving package:', err);
    });

const Restaurant = require('./models/restaurantModel');
const User = require('./models/userModel');
async function findRestaurantOwner() {
    try {
        const owner = await User.findOne({ email: 'sultan@psu.edu.sa', role: 'restaurant_owner' });
        if (!owner) {
            console.log('Restaurant owner not found');
            return;
        }
        console.log('Found owner:', owner._id);
        return owner._id; // Return the owner's ID for linking
    } catch (error) {
        console.error('Error finding restaurant owner:', error);
    }
}

async function addRestaurant() {
    try {
        const ownerId = await findRestaurantOwner(); // Get the owner's ID
        if (!ownerId) return;

        const newRestaurant = new Restaurant({
            name: 'New Restaurant',
            cuisine: 'Italian',
            address: '123 Main St, City',
            contact: '+1234567890',
            picture: '/imgs/Ritzz.jpg',
            owner: ownerId // Link the restaurant to the owner
        });

        await newRestaurant.save(); // Save to the database
        console.log('Restaurant added successfully:', newRestaurant);
    } catch (error) {
        console.error('Error adding restaurant:', error);
    }
}

// Call the function to add a restaurant
addRestaurant();
*/