const joi=require('joi');



module.exports.listingSchema=joi.object({
  listing:joi.object({
    title:joi.string().required(),
    price:joi.number().min(0).required(),
    location:joi.string().required(),
    image:joi.string().uri().required(),
    description:joi.string().required()
  }).required()
  });
  module.exports.reviewSchema=joi.object({
    review:joi.object({
      rating:joi.number().min(1).max(5).required(),
      comment:joi.string().required()
    }).required()
    });