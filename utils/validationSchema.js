const Joi = require("joi");

module.exports.campgroundValidationSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required()
});

module.exports.reviewValidationSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().valid(1, 2, 3, 4, 5).required(),
  }).required()
});
