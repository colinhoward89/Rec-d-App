const mongoose = require('./../db.js');

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
    validate: {
      validator: function(v) {
        // If there is no email address, don't require a password
        if (!v) {
          return true;
        }
        // If there is an email address, require a password
        return this.password && this.password.length >= 6;
      },
      message: props => `A password is required for an email address`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  image: {
    type: String,
    required: false,
  },
  sources: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model('User', userSchema);
