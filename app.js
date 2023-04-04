const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override')
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

// Setup middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Setup routes
app.get('/', (req, res) => {
    res.render('home');
});

// Campgrounds route
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

// New Campground route
app.get('/campgrounds/new', (req ,res) => {
    res.render('campgrounds/new');
})

// New Campground post route
app.post('/campgrounds', async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/Campgrounds/${newCampground._id}`);
})

// Specific campground route
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

// Edit route
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

// Edit route put
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
})

// Delete route
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

// Run server
app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});