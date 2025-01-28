const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  shortKey: {
    type: String,
    unique: true,
    required: true,
  },
  fullUrl: {
    type: String,
    required: true,
  },
});

const urlModel = mongoose.model('url', urlSchema);

module.exports = urlModel;
