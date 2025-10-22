const joi=require('joi');

const listingSchema=joi.object({
  listing:joi.object({
    title:joi.string().required(),
    price:joi.number().min(0).required(),
    location:joi.string().required(),
    image:joi.string().uri().required(),
    description:joi.string().required()
  }).required()
});
module.exports={listingSchema};