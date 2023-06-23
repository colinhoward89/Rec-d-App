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
  // email: {
  //   type: String,
  //   required: function() {
  //     return this.type === 'user';
  //   },
  //   validate: {
  //     validator: function(v) {
  //       // If there is no email address, don't require a password
  //       if (!v) {
  //         return true;
  //       }
  //       // If there is an email address, require a password for users
  //       return this.type === 'user' && this.password && this.password.length >= 6;
  //     },
  //     message: props => `A password is required for an email address`
  //   }
  // },
  email: {
    type: String,
    required: true
  },
  // password: {
  //   type: String,
  //   required: function() {
  //     return this.type === 'user';
  //   },
  //   minlength: 6
  // },
  image: {
    type: String,
    required: false,
  },
  sources: {
    type: Array,
  },
});


module.exports = mongoose.model('User', userSchema);
