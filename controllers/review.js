const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const review = req.body.review;
  const newReview = new Review(review);
  newReview.author = req.user._id; // Set the author to the logged-in user
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${id}`);
};
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
};