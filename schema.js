const joi = require('joi');

module.exports.listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    price: joi.number().min(0).required(),
    location: joi.string().required(),
    image: joi.object({
      url: joi.string().uri().allow('', null),
      filename: joi.string().allow('', null)
    }),
    country: joi.string().required(),
    description: joi.string().required(),
    category: joi.string()
      .valid(
        "Trending",
        "Outdoor getaways",
        "City stays",
        "Cabins and cottages",
        "Unique stays",
        "Windmills",
        "Amazing pools",
        "Arctic homes"
      )
      .required()
  }).required()
});

module.exports.reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().required()
  }).required()
});
