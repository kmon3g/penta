// api/update.js

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

router.post('/',util.isLoggedin, function(req,res,next){ //all --> post
  data = req.body;
  var proj_id=req.decoded.id;
  connection.escape();
  //date ex) 20190615202000 , 2019-06-15 20:20:00

  var query=connection.query('select project_id from vuln where vuln_id=? and project_id=?', [data.vuln_id, proj_id], function(err, results){
    if (err) {
      console.log(err);
      return res.json({success:false, message:"query error"});
   }
   // console.log(results[0]);
   // console.log(typeof(results[0]));
   if(results[0]){
    var query=connection.query('update vuln set vuln_type=?,vuln_url=?,vuln_comment=? where vuln_id=? and project_id=?',[data.vuln_type,data.vuln_url,data.vuln_comment,data.vuln_id,proj_id],function(err, results){
      if (err) {
       console.log(err);
       return res.json({success:false, message:"update query error"});
     }
     return res.json({success:true, message:"수정 완료되었습니다."});
   }); 
  }
  else{//delete error
    return res.json({success:false, message:"수정에 실패하였습니다."});
  }
  });// select query




/*  var query=connection.query('update vuln set vuln_type=?,vuln_url=?,vuln_comment=?,vuln_poc=?,vuln_informer=?,vuln_date=? where vuln_id=?',[data.vuln_type,data.vuln_url,data.vuln_comment,data.vuln_poc,data.vuln_informer,data.vuln_date,data.vuln_id],function(err, results){
    if (err) {
     console.log(err);
     console.log('query error');
     return res.json({message:"query error"});
   }
   
   return res.json({message:"query delete"});
});*///insert query
//특이 사항 변수 쿼리가 아닐 경우 에러 발생
});//router.post end


module.exports = router;