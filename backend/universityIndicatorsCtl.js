// URI:/api/v1/university-indicators
var fs = require('fs');
var lib = require('./libUniversityIndicators.js');
var passport = require('passport');
LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;

passport.use(new LocalAPIKeyStrategy((apikey, done)=> { done(null,apikey); }));

exports.WriteAccess = (req, res, next)=> {
    passport.authenticate('localapikey', (err, apikey, info) =>{
        if(!apikey){
            return res.sendStatus(403);
        }else if (apikey!="write") {
            return res.sendStatus(401);
        }
        return next();
    })(req, res, next);
};

exports.ReadAccess = (req, res, next)=> {
    passport.authenticate('localapikey', (err, apikey, info) =>{
        if(!apikey){
          return res.sendStatus(403);
        }else if (apikey!="read") {
          return res.sendStatus(401);
        }
        return next();
    })(req, res, next);
};


var uis = [];
//////////////////////////////      GET       //////////////////////////////////
exports.loadInitialData = (req,res)=>{
  //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  uis = JSON.parse(fs.readFileSync('./backend/data/university_indicators_initial_data.json','utf8'));
  res.sendStatus(200);
};

//search & pagination implemented
exports.getUIs = (req,res)=>{
  console.log("getUIs");
  //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  switch (lib.whichCase(req)) {
    case 0://Bad request.
      console.log("getUIs - bad request");
      return res.sendStatus(400);
    case 1://DO NOT SEARCH, DO NOT PAGINATION
      console.log("getUIs - dont search, dont paginate ");
      var subArray = uis;
      break;
    case 2://SEARCH, DO NOT PAGINATION
    console.log('cASE 2: ')
      console.log("getUIs - search and dont paginate");
      var subArray = lib.filterFromTo(uis, req.query.from, req.query.to);
      break;
    case 3://DO NOT SEARCH, PAGINATION
      console.log("getUIs - dont search and paginate");
      var subArray = uis;
      var limit = parseInt(req.query.limit);
      var offset = parseInt(req.query.offset);
      if(offset < 0) offset = 0;//evitamos error 500 si se recibe un offset negativo.
      subArray = subArray.slice(offset, (offset+limit));
      break;
    case 4://SEARCH, PAGINATION
      console.log("getUIs - search and paginate");
      var limit = parseInt(req.query.limit);
      var offset = parseInt(req.query.offset);
      //console.log('offset: '+req.query.limit);
      //console.log('limit: '+limit);
      var subArray = lib.filterFromTo(uis, req.query.from, req.query.to);
      //console.log(subArray);
      //console.log('offset+limit: '+(offset+limit));
      if(offset < 0) offset = 0;//evitamos error 500 si se recibe un offset negativo.
      subArray = subArray.slice(offset, (offset+limit));//PAGINATION
      //console.log('SUB');
      //console.log(subArray);
      break;
  }
  (subArray.length == 0) ? res.sendStatus(404) : res.send(subArray);
};

//search & pagination implemented
exports.getUIsByCommunity = (req, res) => {// '/:province(\\D+)/ replaced for '/:province(\\w+)/
  var value = req.params.community;
  console.log("getUIsByCommunity: "+value);
    //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}

    switch (lib.whichCase(req)) {
      case 0://Bad request.
        console.log("getUIsByCommunity - bad request");
        return res.sendStatus(400);
      case 1://DO NOT SEARCH, DO NOT PAGINATION
        console.log("getUIsByCommunity - dont search and dont paginate");
        var subArray = lib.filterBy(uis, 'community', value);
        break;
      case 2://DO SEARCH, DO NOT PAGINATION
        console.log("getUIsByCommunity - search and dont paginate");
        var subArray = lib.filterFromToByCommunity(uis, value, req.query.from, req.query.to);
        break;
      case 3://DO NOT SEARCH, DO PAGINATION
        console.log("getUIsByCommunity - dont search and paginate");
        var subArray = lib.filterBy(uis, 'community', value);
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        if(offset < 0) offset = 0;//evitamos error 500 si se recibe un offset negativo.
        subArray = subArray.slice(offset, (offset+limit));
        break;
      case 4://DO SEARCH, DO PAGINATION
        console.log("getUIsByCommunity - search and paginate");
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        if(offset < 0) offset = 0;//evitamos error 500 si se recibe un offset negativo.
        var subArray = lib.filterFromToByProvince(uis, value, req.query.from, req.query.to);
        subArray = subArray.slice(offset, (offset+limit));//PAGINATION
        break;
    }
    (subArray.length == 0) ? res.sendStatus(404) : res.send(subArray);
}

//search & pagination implemented
exports.getUIsByYear = (req, res) => {
  var value = req.params.year;
  console.log("getUIsByYear: "+value);
    //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
    switch (lib.whichCase(req)) {
      case 0://Bad request.
        console.log("getUIsByCommunity - bad request");
        return res.sendStatus(400);
      case 1://DO NOT SEARCH, DO NOT PAGINATION
        console.log("getUIsByCommunity - dont search and dont paginate");
        var subArray = lib.filterBy(uis, 'year', value);
        break;
      case 2://DO SEARCH, DO NOT PAGINATION
        console.log("getUIsByCommunity - search and dont paginate");
        var subArray = lib.filterFromToByYear(uis, value, req.query.from, req.query.to);
        break;
      case 3://DO NOT SEARCH, DO PAGINATION
        console.log("getUIsByCommunity - dont search and paginate");
        var subArray = lib.filterBy(uis, 'year', value);
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        if(offset < 0) offset = 0;//evitamos error 500 si se recibe un offset negativo.
        subArray.slice(offset, offset+limit);
        break;
      case 4://DO SEARCH, DO PAGINATION
        console.log("getUIsByCommunity - search and paginate");
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        if(offset < 0) offset = 0;//evitamos error 500 si se recibe un offset negativo.
        var subArray = lib.filterFromToByYear(uis, value, req.query.from, req.query.to);
        if(offset < 0) offset = 0;//evitamos error 500 si se recibe un offset negativo.
        subArray.slice(offset, offset+limit);//PAGINATION
        break;
    }
    (subArray.length == 0) ? res.sendStatus(404) : res.send(subArray);
};

//only one element can exits, so it is NOT necessary PAGINATION or SEARCH.
exports.getUI = (req,res)=>{
  //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  var value1 = req.params.community;
  var value2 = req.params.year;
  console.log("getUI: /"+value1+'/'+value2);
  subArray1 = lib.filterBy(uis,'community', value1);
  if(subArray1.length == 0){
    res.sendStatus(404);
  }else{
    subArray2 = lib.filterBy(subArray1, 'year', value2);
    (subArray2.length == 0) ? res.sendStatus(404) : res.send(subArray2);
  }
};

/////////////////////////////////    POST     //////////////////////////////////
/*
router.post('/',(req,res)=>{
  var tm = req.body;
  for(var i=0;i<tms.length;i++){
    if(lib.compareAssociativeArrays(tms[i], tm[0])){
      res.sendStatus(409);//Equal elements, error
      break;
    }
    if(i==tms.length-1){//Last iteration, not equal elements yet, so that add the new element
      tms.push(tm[0]);
      res.sendStatus(201);//Created.
      break;
    }
  }
  console.log("New POST of "+tm[0]["province"]);
});
*/

exports.postUI = (req,res)=>{
  var ui = req.body;
  console.log("postUI: "+ui[0]["province"]);
  //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  if(!lib.isDataCorrect(req,"post")){
    console.log("isDataCorrect - not correct");
    return res.sendStatus(400);
  }
  var subArray1 = lib.filterBy(uis, 'community', ui[0]['community']);
  var subArray2 = lib.filterBy(subArray1, 'year', ui[0]['year']);
    if(subArray2.length == 0){
      console.log("isDataCorrect - correct - push to UIs");
      uis.push(ui[0]);
      res.sendStatus(201);
    }else{
      console.log("isDataCorrect - not correct, already exists");
      res.sendStatus(409);
    }
};

exports.postUIByCommunity = (req,res)=>{
  //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  res.sendStatus(405);
  console.log("Post by community or year is not allowed.");
};
/*
exports.postTMByProvinceYear('/:province/:year', (req,res)=>{
  res.sendStatus(405);
  console.log("Post not allowed.")
};
*/

//////////////////////////////     PUT     /////////////////////////////////////
exports.putToUIs = (req,res)=>{
  //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  console.log("Put to / or /:community is not allowed.");
  res.sendStatus(405);
};

/*
exports.putByProvince = (req,res)=>{
  if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  console.log("Put not allowed.");
  res.sendStatus(405);
};
*/

exports.putUIByCommunityYear = (req,res)=>{
  //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  if(!lib.isDataCorrect(req,undefined)){
    console.log("putUIByCommunityYear - data not correct.")
    return res.sendStatus(400);
  }
  var ui = req.body[0];
  console.log('putUIByCommunityYear - UI: '+ui);
  var value1 = req.params.community;
  var value2 = req.params.year;
  var index = lib.indexOf(uis, 'community', value1, 'year', value2);
  console.log("putUIByCommunityYear: "+value1,value2);
  if(index > -1){
    console.log("putUIByCommunityYear - index: "+index);
    uis[index] = ui;
    res.sendStatus(200);
  }else{
    console.log("putUIByCommunityYear - index==-1");
    res.sendStatus(404);
  }
};

/////////////////////////////       DELETE     /////////////////////////////////
exports.deleteUIs = (req,res)=>{
  //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  console.log("Deleting UIs.");
  uis = [];
  res.sendStatus(200);
};

/*??????????????????????????????????????????????????????????????????
router.delete('/:province', (req, res)=>{

});
*/

exports.deleteUI =  (req,res)=>{
  //if(!lib.verifyAccess(req.query.apikey)){ return res.sendStatus(401);}
  var value1 = req.params.community;
  var value2 = req.params.year;
  console.log("deleteUI: "+value1,value2);
  var index = lib.indexOf(uis, 'community', value1, 'year', value2);
  if(index > -1){
    console.log("deleteUI - index: "+index);
    uis.splice(index, 1);
    res.sendStatus(200);
  }else{
    console.log("deleteUI - index==-1");
    res.sendStatus(400);
  }
};
//
//
//
