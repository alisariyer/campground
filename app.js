const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const Campground = require('./models/campground');

const main = async function () {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
}

// Connect to the database
main()
    .then(() => console.log("Connected to the DB"))
    .catch(err => console.log("Error: ", err));

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup routes
app.get('/', (req, res) => {
    res.render('home');
});

// Campgrounds route
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

// Specific campground route
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

// Run server
app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});