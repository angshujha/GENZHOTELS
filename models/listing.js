const mongoose = require('mongoose');
const Review = require('./review');
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
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});
listingSchema.post('findOneAndDelete', async function(listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
