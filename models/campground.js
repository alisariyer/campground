const mongoose = require("mongoose");
const review = require("./review");
const { Schema, model } = mongoose;

const campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const deleteds = await review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
    console.log(deleteds);
  }
});

module.exports = model("Campground", campgroundSchema);
