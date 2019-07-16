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

/*
router.get('/login', function(req,res,next){ //all --> post

    // console.log(req.query.name);
    if(req.query.name == 'admin'){
      var data = {success: "success"};
      res.json(data);
    }
    else{
      var data = {fail: "fail"};
      res.json(data);
    } 
}); 
*/
router.post('/', function(req,res,next){ //all --> post
  data = req.body;
  var name='';
  console.log('name is :'+data.name);

  connection.escape();
  var query=connection.query('select project_name from project where project_name=?', data.name, function(err, results){
    if (err) {
     console.log(err);
   }
   // console.log(results[0]);
   // console.log(typeof(results[0]));
   if(!results[0]){
    var query=connection.query('insert into project values((select ifnull(max(project_id)+1,0) from project p),?)',data.name, function (err, results) {
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


// login
router.get('/login',
  function(req,res,next){
    var isValid = true;
    var validationError = {
      name:'ValidationError',
      errors:{}
    };

    if(!req.query.name){
      isValid = false;
      validationError.errors.username = {message:'Name is required!'};
    }
    if(!isValid) return res.json(util.successFalse(validationError));
    else next();
  },
  function(req,res,next){
    connection.query('SELECT project_id, project_name FROM project WHERE project_name=?',req.query.name, function(err, results){
      if(err) return res.json(util.successFalse(err));
      else if(!results[0]||(results[0].project_name!==req.query.name))
        return res.json(util.successFalse(null,'invalid'));
      else{
        console.log(results[0]);
        var payload = {
          id : results[0].project_id,
          name: results[0].project_name
        };
        console.log(JSON.stringify(payload));
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
      res.json(util.successTrue(req.decoded));
  }
);

module.exports = router;
