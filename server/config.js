// The domain on which the app is running
var host = process.env.HOST || 'http://localhost:5000'
module.exports.host = host

var mongoURL =
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/TigerConnect';

module.exports.mongoURL = mongoURL;
