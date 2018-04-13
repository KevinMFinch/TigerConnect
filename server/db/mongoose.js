var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TigerConnect');
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds247587.mlab.com:47587/heroku_jgzrkc10');

module.exports = {mongoose};
