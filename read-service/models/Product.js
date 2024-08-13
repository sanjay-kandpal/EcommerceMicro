// read-service/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Product', productSchema);
