const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  requestRec: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'RecUser',
    required: false,
  },
  requestSent: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'RecUser',
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  sources: {
    type: Array,
  },
});


module.exports = mongoose.model('RecUser', userSchema);
