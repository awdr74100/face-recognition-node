const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    descriptors: [String],
  },
  { timestamps: true },
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
