const mongoose = require('./../db.js');

const recommendationSchema = mongoose.Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  sourceComment: {
    type: String,
    required: false,
  },
  recDate: {
    type: String,
    required: true,
  },
  mediaId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  year: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: false,
  },
  ratingDate: {
    type: String,
    required: false,
  },
  ratingComment: {
    type: String,
    required: false,
  },
  urgent: {
    type: Boolean,
    required: false,
  }}, {collection: 'recommendations'});

module.exports = mongoose.model('Recommendation', recommendationSchema);
