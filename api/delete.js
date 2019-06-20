// api/delete.js

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
  data = req.body;
  connection.escape();
  //date ex) 20190615202000 , 2019-06-15 20:20:00
  var query=connection.query('delete from vuln where vuln_id=?',data.vuln_id,function(err, results){
    if (err) {
     console.log(err);
     console.log('query error');
     return res.json({message:"query error"});
   }
   
   return res.json({message:"query delete"});
});//insert query
//특이 사항 변수 쿼리가 아닐 경우 에러 발생
});//router.post end

module.exports = router;