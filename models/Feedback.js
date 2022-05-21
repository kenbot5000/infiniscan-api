const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = require('./User').Schema;
const OrderSchema = require('./Order').Schema;

const FeedbackSchema = new Schema({
  created: Date,
  user: UserSchema,
  order: OrderSchema,
  feedback: String,
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = { Feedback };