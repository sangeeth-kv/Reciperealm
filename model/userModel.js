const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/
  },

  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.facebookId;
    }
  },

  // Social Login IDs
  googleId: {
    type: String,
    default: null
  },

  facebookId: {
    type: String,
    default: null
  },

  // Premium User Fields
  isPremium: {
    type: Boolean,
    default: false
  },

  premium: {
    plan: {
      type: String,
      enum: ['1-month', '2-months', '3-months', null],
      default: null
    },
    startDate: Date,
    endDate: Date,
    paymentAmount: Number
  },

  subscriptionHistory: [
    {
      plan: String,
      startDate: Date,
      endDate: Date,
      paymentAmount: Number,
      transactionId: String
    }
  ],

  savedRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  accountStatus: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },

  profileImage: {
    type: String,
    default: '/images/default-user.png', // Put a default profile pic in your public folder
  },
  refreshToken: {
    type:String
  },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
