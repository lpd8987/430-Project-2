// CODE REUSED FROM PREVIOUS HW ASSIGNMENT (WITH NEW COMMENTS)//
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// The model object to export
let AccountModel = {};

// The schema that the model will use
// Accounts will store a username and password
// (also a created date for good practice)
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  highScore: {
    type: Number,
    required: false,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

// Helper function to hash a password
const saltRounds = 10;
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

// Helper function to compare a hashed password against an existing user password
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

// Convert the empty AccountModel object to something that can be stored by Mongoose
AccountModel = mongoose.model('Account', AccountSchema);

module.exports = AccountModel;
