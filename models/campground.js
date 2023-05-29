const mongoose = require("mongoose");
const review = require("./review");
const { Schema, model } = mongoose;

const imageSchema = new Schema({
  url: String,
  filename: String
})

imageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
})

const campgroundSchema = new Schema({
  title: String,
  images: [imageSchema],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
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
}, {
  toJSON: {
    virtuals: true
  }
});

campgroundSchema.virtual('properties.popupMarkup').get(function() {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p>`;
})

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
