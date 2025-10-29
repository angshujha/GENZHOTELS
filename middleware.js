const Listing = require('./models/listing.js');
 const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError');
const { listingSchema } = require('./schema.js');
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirecturl = req.originalUrl;
    req.flash('error', 'You must be logged in to access that page.');
    return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirecturl) {
    res.locals.redirecturl = req.session.redirecturl;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  // If listing not found
  if (!listing) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings');
  }

  // If no owner assigned (possible for old data)
  if (!listing.owner) {
    req.flash('error', 'This listing has no owner assigned.');
    return res.redirect(`/listings/${id}`);
  }

  // ✅ Proper check — listing.owner is an ObjectId, not an object
  if (!listing.owner.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to modify this listing.');
    return res.redirect(`/listings/${id}`);
  }

  // ✅ Everything ok → move to next middleware
  next();
};
// ✅ Validation middleware
module.exports.validateschema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};
module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
 
  const review = await Review.findById(reviewId);

  // If review not found
  if (!review) {
    req.flash('error', 'Review not found!');
    return res.redirect(`/listings/${id}`);
  }

  // If no author assigned (possible for old data)
  if (!review.author) {
    req.flash('error', 'This review has no author assigned.');
    return res.redirect(`/listings/${id}`);
  }

  // ✅ Proper check — review.author is an ObjectId, not an object
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to modify this review.');
    return res.redirect(`/listings/${id}`);
  }

  // ✅ Everything ok → move to next middleware
  next();
};