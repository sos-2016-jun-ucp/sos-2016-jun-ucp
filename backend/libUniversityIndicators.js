var lib = require('./libUniversityIndicators.js')
var crypto = require('crypto');



exports.filterBy = (array, atr, val) =>{
  return array.filter((element)=>{
    return element[atr] == val; //element.atr no coge el elemento
  });
};

function nrKeys(a) {
    var i = 0;
    for (key in a) {
        i++;
    }
    return i;
}

exports.compareAssociativeArrays = (a, b) =>{
   if (a == b) {
       return true;
   }
   if (nrKeys(a) != nrKeys(b)) {
       return false;
   }
   for (key in a) {
     if (a[key] != b[key]) {
         return false;
     }
   }
   return true;
}

exports.indexOf = (array1, atr1, value1, atr2, value2) =>{
  for(var i = 0;i<array1.length;i++){
    if(array1[i][atr1] == value1 && array1[i][atr2] == value2){
      return i;
    }
  }
  return -1;
}

exports.filterFromToByCommunity = (array, community, since, to)=>{
  var subArray1 = lib.filterBy(array, 'community', community);
  var subArray2 = [];
  for(i in subArray1){
    if(subArray1[i]['year']>=since && subArray1[i]['year']<=to){
      subArray2.push(subArray1[i]);
    }
  }
  return subArray2;
}

exports.filterFromToByYear = (array, year, since, to)=>{
  var subArray1 = lib.filterBy(array, 'year', year);
  var subArray2 = [];
  for(i in subArray1){
    if(subArray1[i]['year']>=since && subArray1[i]['year']<=to){
      subArray2.push(subArray1[i]);
    }
  }
  return subArray2;
}

exports.filterFromTo = (array, since, to)=>{
  var subArray = [];
  for(i in array){
    if(array[i]['year']>=since && array[i]['year']<=to){
      subArray.push(array[i]);
    }
  }
  return subArray;
}

exports.whichCase = (req)=>{
  var since = req.query.from;
  var to = req.query.to;
  var limit = req.query.limit;
  var offset = req.query.offset;
  console.log("whichCase - from: "+since);
  console.log("whichCase - to: "+to);
  console.log("whichCase - offset: "+offset);
  console.log("whichCase - limit: "+limit);
  if( isNaN( parseInt(since))) console.log("no es numero")
  if(!isNaN( parseInt(since))) console.log("es numero")
  if(since == undefined &&
      isNaN( parseInt(since)) &&
      to == undefined &&
      isNaN( parseInt(to)) &&
      limit == undefined &&
      isNaN( parseInt(limit)) &&
      offset == undefined &&
      isNaN( parseInt(offset))){
        console.log("whichCase - dont search and dont pagination");
        return 1;
      } //DO NOT SEARCH, DO NOT PAGINATION
  if(since != undefined &&
      !isNaN( parseInt(since)) &&
      to != undefined &&
      !isNaN( parseInt(to)) &&
      limit == undefined &&
      isNaN( parseInt(limit)) &&
      offset == undefined &&
      isNaN( parseInt(offset))){
        console.log("whichCase - search and dont pagination");
        return 2;
      }//DO SEARCH, DO NOT PAGINATION
  if(since == undefined &&
      isNaN( parseInt(since)) &&
      to == undefined &&
      isNaN( parseInt(to)) &&
      limit != undefined &&
      !isNaN( parseInt(limit)) &&
      offset != undefined &&
      !isNaN( parseInt(offset))){
        console.log("whichCase - dont search and pagination");
        return 3;
      }//DO NOT SEARCH, DO PAGINATION
  if(since != undefined &&
      !isNaN( parseInt(since)) &&
      to != undefined &&
      !isNaN( parseInt(to)) &&
      limit != undefined &&
      !isNaN( parseInt(limit)) &&
      offset != undefined &&
      !isNaN( parseInt(offset))){
      console.log("whichCase - search and pagination");
      return 4;
    }//DO SEARCH, DO PAGINATION
  return 0;//OTHER CASE, BAD REQUEST.
}

var pass = 'pass'
var generalPass = crypto.createHash('sha1').update(pass).digest('hex');
exports.verifyAccess = (key) =>{
  if(key == undefined){return false;}
  var keyShadow = crypto.createHash('sha1').update(key).digest('hex');
  return keyShadow == generalPass;
}

exports.isDataCorrect = (req, type) =>{
  console.log("isDataCorrect");
  var ui = req.body[0];
  var community = req.params.community;
  var year = req.params.year;
  var number = Object.keys(ui).length;
  console.log("isDataCorrect - number: "+number);
  if(type == 'post'){
    if(ui['community'] == undefined ||
      /^\s+$/.test(ui['community']) ||
      ui['year'] == undefined ||
      isNaN(ui['year']) ||
      ui['vacancies'] == undefined ||
      isNaN(ui['vacancies'])  ||
      ui['demand'] == undefined ||
      isNaN(ui['demand']) ||
      number != 4){
      console.log("isDataCorrect - false - UI: "+ui);
      return false;
    }
  }else{
    if(ui['community'] != community ||
     /^\s+$/.test(ui['community']) ||
     ui['year'] != year ||
     isNaN(ui['year']) ||
     ui['vacancies'] == undefined ||
     isNaN(ui['vacancies']) ||
     ui['demand'] == undefined ||
     isNaN(ui['demand']) ||
     number != 4){
      console.log("isDataCorrect - false - UI: "+ui);
      return false;
    }
  }
  console.log("isDataCorrect - true");
  return true;
}
