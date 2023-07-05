const mongoose = require('mongoose');

const recommendationSchema = mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sources: [
      {
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
      },
    ],
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
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    year: {
      type: String,
      required: false,
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
    },
  },
  { collection: 'recommendations' }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);