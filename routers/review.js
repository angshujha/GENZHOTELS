const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing');
const Review = require('../models/review');
const { listingSchema, reviewSchema } = require('../schema');
const { isLoggedIn, isAuthor } = require('../middleware.js');
const reviewcontroller = require('../controllers/review');
const { validatereview } = require('../middleware.js');

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');



//review create route
router.post('/', validatereview,isLoggedIn, wrapAsync(reviewcontroller.createReview));
//review delete route
router.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync(reviewcontroller.deleteReview));
module.exports = router;