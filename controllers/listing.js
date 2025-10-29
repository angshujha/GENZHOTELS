const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render('listings/index.ejs', { listings });
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
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  console.log(req.user);
  newListing.owner = req.user._id; // Set the owner to the logged-in user
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
};
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
};
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
};