const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const main = async function () {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");
};

// Connect to the database
main()
  .then(() => console.log("Connected to the DB"))
  .catch((err) => console.log("Error: ", err));

// Get a random data for title
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  // Test db
  // const c = new Campground({ title: 'Test camp'});
  // await c.save();
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/diswc9ddq/image/upload/v1684782313/YelpCamp/gfgiadpwxyumuyt43xyb.jpg",
          filename: "YelpCamp/gfgiadpwxyumuyt43xyb",
        },
        {
          url: "https://res.cloudinary.com/diswc9ddq/image/upload/v1684782313/YelpCamp/o1vuanbgvy4tdn1p7u7z.jpg",
          filename: "YelpCamp/o1vuanbgvy4tdn1p7u7z",
        },
      ],
      description: `Lorem ipsum image`,
      price,
      geometry: {
        type: "Point",
        coordinates: [-119.699375153073, 37.0743595873945],
      },
      // YOUR USER ID
      author: "6467dec56fa8f8ca89bbd501",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
