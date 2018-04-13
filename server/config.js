// The domain on which the app is running
var host = process.env.HOST || 'http://localhost:5000'
module.exports.host = host

var mongoURL =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost:27017/TigerConnect';

console.log('url', mongoURL);

module.exports.mongoURL = mongoURL;
