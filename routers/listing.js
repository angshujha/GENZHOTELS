const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');

// ✅ Validation middleware
const validateschema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};

// ✅ INDEX - display all listings (no validation here)
router.get('/', wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render('listings/index.ejs', { listings });
}));

// ✅ NEW - show form
router.get('/new', (req, res) => {
  res.render('listings/new.ejs');
});

// ✅ SHOW - single listing
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  res.render('listings/show.ejs', { listing });
}));

// CREATE
router.post('/', validateschema, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
}));

// ✅ EDIT - show edit form
router.get('/:id/edit', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
}));

// ✅ UPDATE

router.put('/:id', validateschema, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });
  res.redirect(`/listings/${id}`);
}));

// ✅ DELETE
router.delete('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}));

module.exports = router;
