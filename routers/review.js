const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing');
const Review = require('../models/review');
const { listingSchema, reviewSchema } = require('../schema');
const { isLoggedIn, isAuthor } = require('../middleware.js');

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};

//review create route
router.post('/', validatereview,isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const review = req.body.review;
  const newReview = new Review(review);
  newReview.author = req.user._id; // Set the author to the logged-in user
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${id}`);
}));
//review delete route
router.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));
module.exports = router;