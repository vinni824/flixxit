const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planType: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true,
  },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  amount: { type: Number, required: true },
  invoiceNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
