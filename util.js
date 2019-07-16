var jwt = require('jsonwebtoken');
var Entities=require('html-entities').AllHtmlEntities;
var util = {};

util.successTrue = function(data){ //1 
  return {
    success:true,
    message:null,
    errors:null,
    data:data
  };
};

util.successFalse = function(err, message){ //2
  if(!err&&!message) message = 'data not found';
  return {
    success:false,
    message:message,
    errors:(err)? util.parseError(err): null,
    data:null
  };
};

util.parseError = function(errors){ //3
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};


// middlewares
util.isLoggedin = function(req,res,next){ //4
  var token = req.headers['x-access-token'];
  if (!token) return res.json(util.successFalse(null,'token is required!'));
  else {
    jwt.verify(token, 'setcretKEYkkkk'/*process.env.JWT_SECRET*/, function(err, decoded) {
      if(err) return res.json(util.successFalse(err));
      else{
        req.decoded = decoded;
        next();
      }
    });
  }
};

// util.xssFilter = function(req,res,next){
//   var method_post=req.body;
//   var method_get=req.query;
//   var entiti=new Entities();
//   for(var key in method_post){
//     method_post[key]=entiti.encode(method_post[key]);
//     // console.log(method_post[key]);
//   }
//   for(var key in method_get){
//     method_get[key]=entiti.encode(method_get[key]);
//     console.log(method_post[key]);
//   }
//   next();
// }

module.exports = util;