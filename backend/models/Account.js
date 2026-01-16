const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  tickets: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for faster ticket searches
accountSchema.index({ tickets: 1 });

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
