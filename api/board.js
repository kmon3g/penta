// api/project_board.js

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

router.post('/', function(req,res,next){ //all --> post
  connection.escape();
  data = req.body;
  var query=connection.query('select * from vuln where project_id=?',data.project_id, function(err, results){
    if (err) {
     console.log(err);
   }
   // console.log(results);
   // console.log(typeof(results[0]));
   if(results[0]){
    return res.json(results);
    }
    else{
      return res.json({message:"board err"});
    }

//특이 사항 변수 쿼리가 아닐 경우 에러 발생
});//select query
});//router.post end

module.exports = router;