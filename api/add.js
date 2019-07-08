// api/add.js

var express  = require('express');
var router   = express.Router();
var User     = require('../models/User');
var util     = require('../util');
var jwt      = require('jsonwebtoken');

// DB
var mysql = require('mysql');
var db_config  = require('../config/conf.json');
var connection = mysql.createConnection({
  host     : db_config.host,
  user     : db_config.user,
  password : db_config.password,
  port : db_config.port,
  database : db_config.database
});

router.post('/', util.isLoggedin, function(req,res,next){ //all --> post
  data = req.body;
  // console.log("decoded: " + JSON.stringify(req.decoded));// print token
  var proj_id=req.decoded.id; //project_id;

  // console.log('name is :'+data.vuln_id);
  // console.log('name is :'+data.vuln_type);
  // console.log('name is :'+data.project_id);
  // console.log('name is :'+data.vuln_url);
  // console.log('name is :'+data.vuln_comment);
  // console.log('name is :'+data.vuln_poc);
  // console.log('name is :'+data.vuln_infomer);
  // console.log('name is :'+data.vuln_date);

  connection.escape(); //쿼터에 %5C[\] 백슬레시 달아줌
  //date ex) 20190615202000 , 2019-06-15 20:20:00
  var query=connection.query('insert into vuln values((select ifnull(max(vuln_id)+1,0) from vuln v),?,?,?,?,\'\',?,now())',[data.vuln_type, proj_id, data.vuln_url, data.vuln_comment, data.vuln_informer],function(err, results){  
    if (err) {
     console.log(err);
     console.log('query error');
     return res.json({success:false,message:"취약점 추가에 실패하였습니다"});
   }
   return res.json({success:true, message:"취약점을 추가하였습니다."});
});//insert query
//특이 사항 변수 쿼리가 아닐 경우 에러 발생
});//router.post end

module.exports = router;