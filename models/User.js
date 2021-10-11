const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  displayID: Number,
  email: String,
  password: String,
  lastname: String,
  firstname: String,
  points: Number
});

const User = mongoose.model('User', UserSchema);

module.exports = { Schema: UserSchema, User };
