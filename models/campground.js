const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const campgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = model('Campground', campgroundSchema);