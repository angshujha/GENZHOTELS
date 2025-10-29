const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync.js');


const { isLoggedIn, isOwner,validateschema } = require('../middleware.js');




// ✅ INDEX - display all listings (no validation here)
router.get('/', wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render('listings/index.ejs', { listings });
}));

// ✅ NEW - show form
router.get('/new', isLoggedIn, (req, res) => {
  res.render('listings/new.ejs');
});

// ✅ SHOW - single listing
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
  console.log(listing);
  res.render('listings/show.ejs', { listing });
}));

// CREATE
router.post('/', isLoggedIn, validateschema, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  console.log(req.user);
  newListing.owner = req.user._id; // Set the owner to the logged-in user
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
}));

// ✅ EDIT - show edit form
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
}));

// ✅ UPDATE

router.put('/:id', isLoggedIn, isOwner, validateschema, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });
  res.redirect(`/listings/${id}`);
}));

// ✅ DELETE
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}));

module.exports = router;
