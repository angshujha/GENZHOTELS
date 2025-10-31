const Listing = require('../models/listing');
const { cloudinary } = require('../cloudconfigur.js');

module.exports.index = async (req, res) => {
  const { category, country } = req.query;
  let filter = {};

  // Filter by category if selected
  if (category) {
    filter.category = category;
  }

  // Filter by country if searched
  if (country) {
    filter.country = { $regex: new RegExp(country, 'i') }; // case-insensitive
  }

  const listings = await Listing.find(filter);
  res.render('listings/index.ejs', { listings, category, country });
};
module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
  console.log(listing);
  res.render('listings/show.ejs', { listing });
};
module.exports.createListing =async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await newListing.save();
  req.flash('success', 'Listing created successfully!');
  res.redirect(`/listings/${newListing._id}`);
};
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
};
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings');
  }

  // ✅ Update fields from form
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.country = req.body.listing.country;
  listing.location = req.body.listing.location;
  listing.category = req.body.listing.category; // ✅ <--- Add this line!

  // ✅ Handle new image upload (if provided)
  if (req.file) {
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();
  req.flash('success', 'Listing updated successfully!');
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
};