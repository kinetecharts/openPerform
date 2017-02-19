var path = require('path');


var util = function(){};

util.in_array=function(array,elm){
     for (var key in array) {
       if (elm.toLowerCase() == array[key].toLowerCase()) {
        return true;
       }
     }
     return false;
}

util.trim=function(strObject){
      var valueType = (typeof strObject).toLowerCase();
       if (valueType == 'string') {
        return strObject.trim();
      }else if(valueType == 'number'){
        return strObject;
      }else if(valueType == 'object'){
        for (var tempKey in strObject) {
          var tempValue = util.trim(strObject[tempKey]);
          if (tempKey != util.trim(tempKey)) {
            delete strObject[tempKey]; //remove old key/value include space
          }

          strObject[util.trim(tempKey)]= tempValue;

        }
        return strObject;
      }else{
        return "";
      }
}


util.getHost = function(req){
  //get poxy hostName
    var host = req.headers['x-forwarded-host'] ? req.headers['x-forwarded-host'] : req.headers['x-forwarded-server'] ;
    if (host) {
      host = (host.split(','))[0];
    }else{
      host = req.headers['host'];
    }
    host = "http://"+host;
    return host;
}

util.isLogin =  function (req,res,next){
    if (req.isAuthenticated()) {
      return next();
    }else{
      var pathsArray = (req.baseUrl).split(path.sep);
      //parse URL like  /api/***
      if (pathsArray && pathsArray.length > 1 && pathsArray[1] == "api") {
          return  res.send({status: 401, message: "You need login."});
      }else{
          return  res.redirect("/login?"+req.originalUrl);
      }
    }
}


util.isManager =  function (req,res,next){
    if (req.isAuthenticated() && req.session && 
     req.session.passport && req.session.passport.userInfo &&
     req.session.passport.userInfo.userType == 1) {
       return next();
    }else{
      var pathsArray = (req.baseUrl).split(path.sep);

      //parse URL like  /api/***
      if (pathsArray && pathsArray.length > 1 && pathsArray[1] == "api") {
          return  res.send({status: 401, message: "You must is a manger."});
      }else{
          return  res.redirect("/");
      }
    }
}


util.mergeReqParams = function(req, res, next){
       req.parameters ={};

    //support raw body JSON Data
      if (req.rawBody) {
         for (var key in req.rawBody) {
          req.parameters[key] = req.rawBody[key];
        }
      }

      //Merge  req.query
      for (var queryKey in req.query) {
        req.parameters[queryKey] = req.query[queryKey];
      }

      //Merge  req.params
      for (var key in req.params) {
        req.parameters[key] = req.params[key];
      }

      //Merge  req.body
      for (var bodyKey in req.body) {
        req.parameters[bodyKey] = req.body[bodyKey];
      }

      //add session userId
      if (req.session && req.session.passport && req.session.passport.userInfo && req.session.passport.userInfo._id) {
         req.parameters['userId'] =  req.session.passport.userInfo._id;
      }else{
         req.parameters['userId'] = "";
      }

      next();
  }

util.mergeJSONKeyValue = function(req, res, next){

  var JOSNKeyValue = req.parameters['json'];

    if (JOSNKeyValue  && typeof(JOSNKeyValue) == "string" ) {
        try{
         var tempJSONObject = JSON.parse(JOSNKeyValue);
         if (tempJSONObject) {
             for (var jsonKey in tempJSONObject) {
              req.parameters[jsonKey] = tempJSONObject[jsonKey];
            }
         }
        } catch(err) {
         console.log(err);
        }
      }
      next();
  }

util.randomAlphaNum = function(len) {
       var value="";
       var i=0;
       var charactors="ab1cd2ef3gh4ij5kl6mn7opq8rst9uvw0xyz";
        for(var j=1;j<=len;j++){
            i = parseInt(35*Math.random()); 　
            value = value + charactors.charAt(i);
       }
       return value;
  }

util.isNullOrEmpty = function(strVal) {

  if (typeof strVal == 'object') {
    return util.isEmptyObject(strVal);
  }
    if (strVal === '' || strVal === null || strVal === 'null' || strVal === undefined || strVal === 'undefined') {
        return true;
    } else {
        return false;
    }
}

util.isEmptyObject = function(O){
  if (typeof O != 'object') {
    return true;
  }
  for (var x in O){
    return false;
  }
  return true;
}

util.deepCopy = function(source) {
    var result ;
    if (Array.isArray(source)) {
        result= [];
    }else if((typeof source).toLowerCase() == 'object'){
        result = {};
    }else{
        return source;
    }
    for (var key in source) {
        result[key] =  this.deepCopy(source[key]);
    }
    return result;
}

util.convertKeyValueStringToObject = function(keyValueString){
    //Support value is key=value|key=value|key=value . auto convert to json.
    if((typeof keyValueString).toLowerCase() == "string" &&  keyValueString.indexOf("=") > 0){
        var tempObject = {};
        keyValueString.split("|").filter(function(s){return s.length > 0})
            .map(function(s) {//key=value|key=value|key=value
                var t= util.trim(s).split("=");
                //maybe have bug, will override old data
                tempObject[util.trim(t[0])]=util.trim(t[1]);
            });
        //replace key=value|key=value|key=value  to object
        return tempObject;
    }
    return keyValueString;
 }



module.exports = util;
