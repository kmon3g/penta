// server.js

var express    = require('express');
var app        = express();
var path       = require('path');
var bodyParser = require('body-parser');


// Database
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGO_DB);
// var db = mongoose.connection;
// db.once('open', function () {
//    console.log('DB connected!');
// });
// db.on('error', function (err) {
//   console.log('DB ERROR:', err);
// });

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1
  next();
});



// API
app.use('/api/users', require('./api/users')); //2
app.use('/api/auth', require('./api/auth'));   //2
app.use('/api/board', require('./api/board'));   //2
app.use('/api/add', require('./api/add'));   //2
app.use('/api/delete', require('./api/delete'));   //2
app.use('/api/update', require('./api/update'));   //2

var router = express.Router();

// Server
// var port = 3000;
// app.listen(port, function(){
  // console.log('listening on port:' + port);
// });

module.exports = app;