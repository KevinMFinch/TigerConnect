var mongoose = require('mongoose');
var config = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURL)
// mongoose.connect('mongodb://localhost:27017/TigerConnect');

module.exports = {mongoose};
