// api/auth.js

var express  = require('express');
var router   = express.Router();
var User     = require('../models/User');
var util     = require('../util');
var jwt      = require('jsonwebtoken');

//DB
var mysql = require('mysql');
var db_config  = require('../config/conf.json');
var connection = mysql.createConnection({
  host     : db_config.host,
  user     : db_config.user,
  password : db_config.password,
  port : db_config.port,
  database : db_config.database
});
// connection.connect((err) => {
//     if(err) {
//         console.log(err);
//         return;
//     }
//     console.log( 'mysql connect completed' );
// });
//test
router.post('/', function(req,res,next){ //all --> post
  data = req.body;
  var name='';
  console.log('name is :'+data.name);

  connection.escape();
  var query=connection.query('select project_name from project where project_name=?', data.name, function(err, results){
    if (err) {
     console.log(err);
   }
   console.log(results[0]);
   console.log(typeof(results[0]));
   if(!results[0]){
    var query=connection.query('insert into project values((select max(project_id)+1 from project a),?)',data.name, function (err, results) {
      if (err) {
       console.log(err);
     }
     console.log('name3 ='+data.name);
     return res.json({message:"name is insert!"});
   });
  }
  else{
   name=results[0].project_name;
   console.log('result = '+results[0].project_name);
   console.log('name = '+name);
   if(name==data.name){
    console.log('name2 ='+name);
    return res.json({message:"name is duplicated!"});
    }
  }
  //특이 사항 변수 쿼리가 아닐 경우 에러 발생
});
  // var query1=connection.query('insert into project values((select max(project_id)+1 from project a),?)',data.name, function (err, results) {
  //     if (err) {
  //      console.log(err);
  //    }
  //    console.log('name3 ='+data.name);
  //    return res.send('name3 ='+data.name);
  //  });
  // output message
  // insert_into_query(data.name,res);
  
  // connection.query(`insert into project values((select count(project_id)+1 from project a),'${data.name}')`, function (error, results, fields) {
  //   if (error) {
  //     console.log(error);
  //   }
  //   console.log(results);
  //   res.json({result:results});
  // });
});

/////////////////////////////////////////////////////////////////////////////////////////

function insert_into_query(data,res) {
  var name='';
  console.log(data);
  connection.escape();
  var query=connection.query('select project_name from project where project_name=?', data, function(err, results){
    if (err) {
      console.log(err);
    }
    name=results[0].project_name;
    console.log('result = '+results[0].project_name);
    console.log('name = '+name);
  });
  console.log('name1 ='+name);
  console.log('data ='+data);
  if(name==data){
    res.send('name2 ='+name);
  }
  else{
    console.log('name3');
    res.json({result:results});
  }
}


// login
router.post('/login',
  function(req,res,next){
    var isValid = true;
    var validationError = {
      name:'ValidationError',
      errors:{}
    };

    if(!req.body.username){
      isValid = false;
      validationError.errors.username = {message:'Username is required!'};
    }
    if(!req.body.password){
      isValid = false;
      validationError.errors.password = {message:'Password is required!'};
    }

    if(!isValid) return res.json(util.successFalse(validationError));
    else next();
  },
  function(req,res,next){
    User.findOne({username:req.body.username})
    .select({password:1,username:1,name:1,email:1})
    .exec(function(err,user){
      if(err) return res.json(util.successFalse(err));
      else if(!user||!user.authenticate(req.body.password))
         return res.json(util.successFalse(null,'Username or Password is invalid'));
      else {
        var payload = {
          _id : user._id,
          username: user.username
        };
        var secretOrPrivateKey = process.env.JWT_SECRET;
        var options = {expiresIn: 60*60*24};
        jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
          if(err) return res.json(util.successFalse(err));
          res.json(util.successTrue(token));
        });
      }
    });
  }
);

// me
router.get('/me', util.isLoggedin,
  function(req,res,next) {
    User.findById(req.decoded._id)
    .exec(function(err,user){
      if(err||!user) return res.json(util.successFalse(err));
      res.json(util.successTrue(user));
    });
  }
);

// refresh
router.get('/refresh', util.isLoggedin,
  function(req,res,next) {
    User.findById(req.decoded._id)
    .exec(function(err,user){
      if(err||!user) return res.json(util.successFalse(err));
      else {
        var payload = {
          _id : user._id,
          username: user.username
        };
        var secretOrPrivateKey = process.env.JWT_SECRET;
        var options = {expiresIn: 60*60*24};
        jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
          if(err) return res.json(util.successFalse(err));
          res.json(util.successTrue(token));
        });
      }
    });
  }
);

module.exports = router;