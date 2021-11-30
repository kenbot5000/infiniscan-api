const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  isstandard: Boolean,
});

const Admin = mongoose.model('Admin', AdminSchema);
const AdminArchive = mongoose.model('AdminArchive', AdminSchema);

module.exports = { Schema: AdminSchema, Admin, AdminArchive };
