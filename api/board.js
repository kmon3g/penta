// api/board.js

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


router.get('/', util.isLoggedin,function(req,res,next){ //all --> post
  // data = req.body;
  var proj_id=req.decoded.id; //project_id;
  connection.escape();
  //id 던져주면 vuln list 응답
  var query=connection.query('select vuln_type,vuln_url,vuln_comment,vuln_poc,vuln_informer,vuln_date from vuln vul, project proj where vul.project_id=proj.project_id and proj.project_id=?',proj_id, function(err, results){
    if (err) {
     console.log(err);
   }
   // console.log(results);
   // console.log(typeof(results[0]));


   if(results[0]){

  var number=1;
  var html_2='';
  //number
  results.forEach(function(element){
  html_2+='<tr>';
    html_2+='<td>'+number+'</td>';
    html_2+='<td>'+element.vuln_type+'</td>';
    html_2+='<td>'+element.vuln_informer+'</td>';
    html_2+='<td>'+element.vuln_url+'</td>';
    html_2+='<td>'+element.vuln_poc+'</td>';
    html_2+='<td>'+element.vuln_date+'</td>';
  html_2+='</tr>';
    number+=1;
  })
       var html_1 = `
    <table id="hor-minimalist-a" summary="Employee Pay Sheet">
            <thead>
                <tr>
                    <th scope="col">순번</th>
                    <th scope="col">취약점유형</th>
                    <th scope="col">제보자</th>
                    <th scope="col">URL</th>
                    <th scope="col">세부정보</th>
                    <th scope="col">날짜</th>
                </tr>
            </thead>
            <tbody>
            ${html_2}
            </tbody>
            </table>`;
   
  /*`
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>
                        <a id="modal" data-toggle="modal" href="#myModal">
                            <i class="fa fa-plus iconfont" aria-hidden="true"></i>
                        </a>
                    </td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>SQLI</td>
                    <td>XXE</td>
                    <td>FILE UPLOAD</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>$200</td>
                    <td>$35</td>
                    <td>Andy</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>$175</td>
                    <td>$25</td>
                    <td>Annie</td>
                </tr>
            </tbody>
        </table>
   `;*/
    return res.json({success:true,data:html_1});
    }
    else{
      return res.json({message:"board err"});
    }

//특이 사항 변수 쿼리가 아닐 경우 에러 발생
});//select query
});//router.post end

module.exports = router;