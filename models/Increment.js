const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncrementSchema = new Schema({
  name: String,
  currentValue: Number,
});

const Increment = mongoose.model('Increment', IncrementSchema);

module.exports = Increment;