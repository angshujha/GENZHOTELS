const mongoose = require('mongoose');
const Review = require('./review');
const schema = mongoose.Schema;

const listingSchema = new schema({
  title: String,
  location: String,
  price: Number,
  description: String,
  image: {
    url: String,
    filename: String
  },
  country: String,
  
  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Outdoor getaways",
      "City stays",
      "Cabins and cottages",
      "Unique stays",
      "Windmills",
      "Amazing pools",
      "Arctic homes"
    ],
    required: true
  },

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
