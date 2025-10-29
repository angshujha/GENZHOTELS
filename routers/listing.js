const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync.js');
const listingcontroller = require('../controllers/listing.js');


const { isLoggedIn, isOwner,validateschema } = require('../middleware.js');
router
  .route('/')
  .get(wrapAsync(listingcontroller.index))
  .post(isLoggedIn, validateschema, wrapAsync(listingcontroller.createListing));
router
  .route('/:id')
  .get(wrapAsync(listingcontroller.showListing))
  .put(isLoggedIn, isOwner, validateschema, wrapAsync(listingcontroller.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.deleteListing));
router
  .route('/new')
  .get(isLoggedIn, listingcontroller.renderNewForm);
router
  .route('/:id/edit')
  .get(isLoggedIn, isOwner, wrapAsync(listingcontroller.renderEditForm));

module.exports = router;









