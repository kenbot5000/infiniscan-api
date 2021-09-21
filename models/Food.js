const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  displayID: Number,
  name: String,
  type: String,
  ingredients: [Schema.Types.ObjectId],
  price: Number
});

const Food = mongoose.model('Food', FoodSchema);
const FoodArchive = mongoose.model('FoodArchive', FoodSchema);

module.exports = { Schema: FoodSchema, Food, FoodArchive };
