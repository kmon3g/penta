// api/board.js

var express  = require('express');
var router   = express.Router();
var User     = require('../models/User');
var util     = require('../util');
var jwt      = require('jsonwebtoken');
var Entities=require('html-entities').AllHtmlEntities;

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


router.get('/', util.isLoggedin,function(req,res,next){ //all --> post
  // data = req.body;
  var proj_id=req.decoded.id; //project_id;
  connection.escape();
  //id 던져주면 vuln list 응답
  var query=connection.query('select vuln_id,vuln_type,vuln_url,vuln_comment,vuln_informer,date_format(vuln_date, \'%Y-%m-%d\') as vuln_date from vuln vul, project proj where vul.project_id=proj.project_id and proj.project_id=?',proj_id, function(err, results){
    if (err) {
     console.log(err);
   }
   // console.log(results);
   // console.log(typeof(results[0]));


  var number=1;
  var tmp='';
  var entiti=new Entities();
  results.forEach(function(element){
    var modalbtn = `<a id="more${number}" class="openmodal" data-toggle="modal" href="#"><i class="fa fa-plus iconfont" aria-hidden="true"></i></a>`
    tmp+='<tr>';
    tmp+='<td>'+number+'</td>';
    tmp+='<td>'+entiti.encode(element.vuln_type)+'</td>';
    tmp+='<td>'+entiti.encode(element.vuln_informer)+'</td>';
    tmp+='<td>'+entiti.encode(element.vuln_url)+'</td>';
    // tmp+='<td>'+element.vuln_poc+'</td>';
    tmp+='<td>'+entiti.encode(element.vuln_date)+'</td>';
    tmp+='<td>'+modalbtn+'</td>';
    tmp+='</tr>';
    number+=1;
  })
       var html = `
    <table id="hor-minimalist-a">
            <thead>
                <tr>
                    <th scope="col">순번</th>
                    <th scope="col">취약점유형</th>
                    <th scope="col">제보자</th>
                    <th scope="col">URL</th>
                    <th scope="col">날짜</th>
                    <th scope="col">세부정보</th>
                </tr>
            </thead>
            <tbody>
            ${tmp}
            </tbody>
            </table>
    <div class="container div-add">
      <div class="row">
        <div class="col-10">
        </div>
        <div class="col-2">
            <div class="btn original-btn add">추가</div>
        </div>
      </div>
    </div>`;
   if(results[0]){
  //number
   
    return res.json({success:true, html:html, data:results});
    }
    else{
      return res.json({success:true, html:html, data:results});
    }

//특이 사항 변수 쿼리가 아닐 경우 에러 발생
});//select query
});//router.post end

module.exports = router;
