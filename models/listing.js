const mongoose = require('mongoose');
const schema = mongoose.Schema;

const listingSchema = new schema({
  title: String,
  location: String,
  price: Number,
  description: String,
  image: {
    filename: String,
    url: String,
  },
  country: String
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
