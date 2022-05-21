const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = require('./User').Schema;
const FoodSchema = require('./Food').Schema;
const PromoSchema = require('./Promo').Schema;
const AdminSchema = require('./Admin').Schema;

const OrderSchema = new Schema({
  created: Date,
  user: UserSchema,
  items: [FoodSchema],
  total: Number,
  promo: [PromoSchema],
  subtotal: Number,
  status: String,
  server: AdminSchema,
});

const Order = mongoose.model('Order', OrderSchema);
const OrderArchive = mongoose.model('OrderArchive', OrderSchema);

module.exports = { Schema: OrderSchema, Order, OrderArchive };
