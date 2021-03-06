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

router.post('/',util.isLoggedin, function(req,res,next){ //all --> post
  data = req.body;
  var proj_id=req.decoded.id; //project_id;
  connection.escape();
    var query=connection.query('select * from vuln where vuln_id=? and project_id=?', [data.vuln_id, proj_id], function(err, results){
    if (err) {
     console.log(err);
     return res.json({message:"select error"});
   }
   // console.log(results[0]);
   // console.log(typeof(results[0]));
   if(results[0]){
    var query=connection.query('delete from vuln where vuln_id=? and project_id=?',[data.vuln_id,proj_id], function (err, results) {
      if (err) {
       console.log(err);
       return res.json({success:false,message:"삭제를 실패하였습니다."});
     }
     return res.json({success:true,message:"삭제를 성공하였습니다."});
   });//delete query 
  }
  else{//delete error
    return res.json({success:false,message:"해당 항목이 없습니다."});
    }
  });// select query
  //특이 사항 변수 쿼리가 아닐 경우 에러 발생
});//router.post end

module.exports = router;