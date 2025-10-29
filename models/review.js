const mongoose = require('mongoose');
const schema = mongoose.Schema;
const reviewSchema = new schema({
    comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  author : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
});

module.exports = mongoose.model('Review', reviewSchema);