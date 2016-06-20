
var API_URL = "/api/v1/university-indicators";
var table;
var currentButton ="";
var request;
var offset = parseInt(0);
var apikey = "";
var first = true;



$(document).ready(()=>{
  console.log("JQUERY READY!");

  $("#show-data").click(showDataButton);
  $("#add-data").click(addButton);
  $("#deleteall-data").click(deleteAllButton);
  $("#load-initial-data").click(loadInitialDataButton);
  $("#update-data").click(updateButton);
  $("#form-button").click(formButton);
  $("#previous-page").click(previousPage);
  $("#next-page").click(nextPage);
  $("#delete-data").click(deleteButton);
  $("#log-button").click(logButton);


});

function formButton(){
  switch(currentButton){
    case "":
      $("#log").text("Select a button, please.");
      $("#logDiv").show(700);
      $("#data").hide();
      break;
    case "SHOW":
      showFunction();
      break;
    case "LOAD":
      loadInitialData();
      break;
    case "POST":
      post();
      break;
    case "UPDATE":
      update();
      break;
    case "DELETEALL":
      deleteAll();
      break;
    case "DELETE":
      deletee();
      break;
  }
}

function showFunction(){
  //makeRequest(type, apikey, offset, limit, from, to, community, year, vacancies, demand);
  console.log("function showFunction");
  makeRequest("GET", $("#apikey-input").val(), 0, $("#limit").val(), $("#from-input").val(), $("#to-input").val(),
    $("#community-input").val(), $("#year-input").val(), undefined, undefined);
  makeTable(request);
  checkStatus(request);
}

function post(){
  //makeRequest(type, apikey, offset, limit, fromm, to, community, year, vacancies, demand);
  console.log("function post");
  makeRequest("POST", $("#apikey-input").val(), undefined, undefined, undefined, undefined,
    $("#community-input").val(), $("#year-input").val(), $("#vacancies-input").val(), $("#demand-input").val());
  makeTable(request);
  checkStatus(request);
}

function update(){
  console.log("function update");
  makeRequest("PUT", $("#apikey-input").val(), undefined, undefined, undefined, undefined,
    $("#community-input").val(), $("#year-input").val(), $("#vacancies-input").val(), $("#demand-input").val());
  //makeTable(request);
  checkStatus(request);
  request.done((data,status,jqXHR)=>{
    console.log("function update - done");
    makeRequest("GET", "read", offset, $("#limit").val(), $("from-input").val(), $("to-input").val(), undefined, undefined,
      undefined, undefined);
    makeTable(request);
    checkStatus(request);
  });
}

function deleteAll(){
  console.log("function deleteAll");
  makeRequest("DELETEALL", $("#apikey-input").val(), undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined);
  makeTable(request);
  checkStatus(request);
}

function deletee(){
  console.log("function delete");
  makeRequest("DELETE", $("#apikey-input").val(), undefined, undefined, undefined, undefined, $("#community-input").val(), $("#year-input").val(),
    undefined, undefined);
//  checkStatus(request);
  //request.done((data,status,jqXHR)=>{
    console.log("function update - done");
    makeRequest("GET", "read", offset, $("#limit").val(), $("from-input").val(), $("to-input").val(), undefined, undefined,
      undefined, undefined);
    makeTable(request);
    checkStatus(request);
  //});
}

function loadInitialData(){
  //makeRequest(type, apikey, offset, limit, from, to, community, year, vacancies, demand);
  console.log("function loadinitialdata");
  makeRequest("GET", $("#apikey-input").val(), undefined, undefined, undefined, undefined, "loadInitialData", undefined,
    undefined, undefined);
  makeRequest("GET", "read", offset, $("#limit").val(), $("from-input").val(), $("to-input").val(), undefined, undefined,
      undefined, undefined);
  makeTable(request);
  checkStatus(request);
  //this.reload();
}

function makeRequest(type, apikey, offset2, limit, fromm, to, community, year, vacancies, demand){
  console.log("function makeRequest.");
  var url = API_URL;

  if(type == "GET"){
    console.log("function makeRequest - GET.");
    if(community != undefined && community.length > 0) url += "/"+community;
    if(year != undefined && year.length > 0) url += "/"+year;
    if(apikey != undefined && apikey.length > 0) url += "?apikey="+apikey;
    if(offset2 != undefined) url += "&offset="+offset2;
    if(limit !=undefined) url += "&limit="+limit;
    if(fromm != undefined && parseInt($("#from-input").val()) > 0) url += "&from="+fromm;
    if(to != undefined && parseInt($("#to-input").val()) > 0) url += "&to="+to;
    console.log("URL: "+url);
    console.log("offset2: "+offset2);
    //console.log("fromm: "+fromm+" y $(fromm-input): "+$("#from-input").val());
    //console.log("to: "+to+" y $(to-input): "+$("#to-input").val());
    request = $.ajax({
      "type": "GET",
      "url": url,
      async: false
    });
    /*
    request.done(()=>{
      console.log("function makeRequest - GET - done")
      offset = parseInt($("#limit").val());
    });
    */
  }else if(type == "POST"){
    //community and year must be undefined.
    console.log("function makeRequest - POST.");
    if(apikey != undefined && apikey.length > 0) url += "?apikey="+apikey;
    datum = '[{"community":"'+$("#community-input").val()+'", "year":"'+$("#year-input").val()+'", "vacancies":'+$("#vacancies-input").val()+', "demand":'+$("#demand-input").val()+'}]';
    console.log("makeRequest - post - datum: "+datum)
    request = $.ajax({
      url : url,
      type : "POST",
      data : datum,
      dataType : "json",
      contentType : "application/json",
      async: false
    });
  }else if(type == "PUT"){
    console.log("function makeRequest - PUT.");
    if(community != undefined && community.length > 0) url += "/"+community;
    if(year != undefined && year.length > 0) url += "/"+year;
    if(apikey != undefined && apikey.length > 0) url += "?apikey="+apikey;
    console.log("function makeRequest - PUT - URL: "+url);
    datum = '[{"community":"'+$("#community-input").val()+'", "year":"'+$("#year-input").val()+'", "vacancies":'+$("#vacancies-input").val()+', "demand":'+$("#demand-input").val()+'}]';
    request = $.ajax({
      url : url,
      type : "PUT",
      data : datum,
      dataType : "json",
      contentType : "application/json",
      async: false
    });
  }else if(type == "DELETEALL"){
    console.log("function makeRequest - DELETEALL.");
    if(apikey != undefined && apikey.length > 0) url += "?apikey="+apikey;
    request = $.ajax({
      url : url,
      type : "DELETE",
      dataType : "json",
      async: false
    });

  }else if(type == "DELETE"){
    console.log("function makeRequest - DELETE.");
    if(community != undefined && community.length > 0) url += "/"+community;
    if(year != undefined && year.length > 0) url += "/"+year;
    if(apikey != undefined && apikey.length > 0) url += "?apikey="+apikey;
    console.log("function makeRequest - DELETE - URL: "+url);
    request = $.ajax({
      url : url,
      type : "DELETE",
      dataType : "json",
      async: false
    });
  }

}


function makeTable(request){
  console.log("function makeTable");

  request.done((data,status,jqXHR) =>{
    console.log("function makeTable - request.done");
  $("#tabla tr").remove();
  var metadata = [];
          metadata.push({ name: "community", label: "Community"});
          metadata.push({ name: "year", label:"Year"});
          metadata.push({ name: "vacancies", label:"Vacancies"});
          metadata.push({ name: "demand", label: "Demand"});
  var newData = [];
  for(i=0;i<data.length;i++){
      newData.push({id: i,values: {"community":data[i]["community"],"year":data[i]["year"],"vacancies":data[i]["vacancies"], "demand":data[i]["demand"]}});
  }
  var pageSize = data.length;
  var rowSettings = {evenRowStyle:{"background":"#d8e6f0"},oddRowStyle:{"background":"#fcfcfc"},
                    hoverStyle:{"background-color":"#99CCFF"}, rowFunctions:
        [{eventType:"click",functionToCall:rowClicked}]};
  tabla = new CoolTable('tabla',metadata,newData,'coolgrid',pageSize,rowSettings);
  tabla.drawTable();


  });//done
  request.fail(()=>{
    console.log("function makeTable - request.fail");
    $("#tabla tr").remove();
  });//fail

}

function rowClicked(){
  console.log('clicked on a row')
      $(this).toggleClass("highlight");
}



function checkStatus(request){
  console.log("function checkStatus");
  //console.log("function checkStatus - status: "+request.jqXHR.status);
  request.always((jqXHR,status)=>{
    console.log("function checkStatus - request.always");
    if(jqXHR.status == 400){
      console.log("function checkStatus - status==400.");
      $("#log").text("Some datum/data is/are incorrect.");
      $("#logDiv").show(700);
      $("#data").hide();
    }else if(jqXHR.status == 401){
      console.log("function checkStatus - 401");
      $("#log").text("You are UNAUTHORIZED. Type a correct APIKEY");
      $("#logDiv").show(700);
      $("#data").hide();
    } else if(jqXHR.status == 403){
      console.log("function checkStatus - 403");
      $("#log").text("Apikey incorrect.");
      $("#logDiv").show(700);
      $("#data").hide();
    }else if(jqXHR.status == 404){
      console.log("function checkStatus - 404");
      $("#log").text("There are not elements.");
      $("#logDiv").show(700);
      $("#data").hide();
    }else if(jqXHR.status == 409){
      console.log("function checkStatus - 409");
      $("#log").text("There was a CONFLICT with the data.");
      $("#logDiv").show(700);
      $("#data").hide();
    }
  });
}

function reload(){
  location.reload();
}


// BUTTONS

function nextPage(){
  console.log("function nextPage");
  var url = API_URL;
    if($("#community-input").val() != undefined && $("#community-input").val().length > 0) url += "/"+$("#community-input").val();
    if($("#year-input").val() != undefined && $("#year-input").val().length > 0) url += "/"+$("#year-input").val();
    if($("#apikey-input").val() != undefined && $("#apikey-input").val().length > 0) url += "?apikey="+$("#apikey-input").val();
    if(first) offset += parseInt($("#limit").val());
    url += "&offset="+offset;
    if($("#limit").val() !=undefined) url += "&limit="+$("#limit").val();
    if(parseInt($("#from-input").val()) != undefined && parseInt($("#from-input").val()) > 0) url += "&from="+parseInt($("#from-input").val());
    if(parseInt($("#to-input").val()) != undefined && parseInt($("#to-input").val()) > 0) url += "&to="+parseInt($("#to-input").val());
    console.log("function nextPage - URL: "+url);
    request = $.ajax({
      "type": "GET",
      "url": url,
      async: false
    });
  request.done(()=>{
    console.log("function nextPage - done")
    //offset += parseInt($("#limit").val());
    first = true;

  });
  console.log("function nextPage - tras req.done - offset: "+offset);
  request.fail(()=>{
    first = false;
  });
  makeTable(request);
  checkStatus(request);
}

function previousPage(){
  console.log("function nextPage");
    var url = API_URL;
      if($("#community-input").val() != undefined && $("#community-input").val().length > 0) url += "/"+$("#community-input").val();
      if($("#year-input").val() != undefined && $("#year-input").val().length > 0) url += "/"+$("#year-input").val();
      if($("#apikey-input").val() != undefined && $("#apikey-input").val().length > 0) url += "?apikey="+$("#apikey-input").val();
      url += "&offset="+(offset -parseInt($("#limit").val()));
      if($("#limit").val() !=undefined) url += "&limit="+$("#limit").val();
      if(parseInt($("#from-input").val()) != undefined && parseInt($("#from-input").val()) > 0) url += "&from="+parseInt($("#from-input").val());
      if(parseInt($("#to-input").val()) != undefined && parseInt($("#to-input").val()) > 0) url += "&to="+parseInt($("#to-input").val());
      console.log("function nextPage - URL: "+url);
      request = $.ajax({
        "type": "GET",
        "url": url,
        async: false
      });
    request.done(()=>{
      console.log("function nextPage - done")
      offset -= parseInt($("#limit").val());
      if(offset<0){
        offset = parseInt(0);
        first = true;
      }
    });
    console.log("function nextPage - offset tras actualizacion: "+offset);
  makeTable(request);
  checkStatus(request);
}

function logButton(){
  $("#logDiv").hide();
  $("#data").show(700);
}

function showDataButton(){
  console.log("function showDataButton");
  $('#community-input').attr('disabled', false);
  $('#year-input').attr('disabled', false);
  $('#vacancies-input').attr('disabled', true);
  $('#demand-input').attr('disabled', true);
  $('#from-input').attr('disabled', false);
  $('#to-input').attr('disabled', false);
  currentButton = "SHOW";
}


function updateButton(){
  $('#community-input').attr('disabled', false);
  $('#year-input').attr('disabled', false);
  $('#vacancies-input').attr('disabled', false);
  $('#demand-input').attr('disabled', false);
  $('#from-input').attr('disabled', true);
  $('#to-input').attr('disabled', true);
  currentButton = "UPDATE";
}

function addButton(){
  $('#community-input').attr('disabled', false);
  $('#year-input').attr('disabled', false);
  $('#vacancies-input').attr('disabled', false);
  $('#demand-input').attr('disabled', false);
  $('#from-input').attr('disabled', true);
  $('#to-input').attr('disabled', true);
  currentButton = "POST";
}

function deleteAllButton(){
  $('#community-input').attr('disabled', true);
  $('#year-input').attr('disabled', true);
  $('#vacancies-input').attr('disabled', true);
  $('#demand-input').attr('disabled', true);
  $('#from-input').attr('disabled', true);
  $('#to-input').attr('disabled', true);
  currentButton = "DELETEALL";
}

function deleteButton(){
  $('#community-input').attr('disabled', false);
  $('#year-input').attr('disabled', false);
  $('#vacancies-input').attr('disabled', true);
  $('#demand-input').attr('disabled', true);
  $('#from-input').attr('disabled', true);
  $('#to-input').attr('disabled', true);
  currentButton = "DELETE";
}

function loadInitialDataButton(){
  $('#community-input').attr('disabled', true);
  $('#year-input').attr('disabled', true);
  $('#vacancies-input').attr('disabled', true);
  $('#demand-input').attr('disabled', true);
  $('#from-input').attr('disabled', true);
  $('#to-input').attr('disabled', true);
  currentButton = "LOAD";
}











//NO SE EJECUTA FUNCION
/*
$("#borrartabla").click(function(){
  console.log("borrando tabla");
    $('#tabla').columns("destroy");
    makeTable(request);
});
*/

/*
function checkAndMake(request){
  console.log("function checkAndMake");
  var stat = checkStatus(request);
  console.log("Status: "+stat);
  if(stat == true){
    console.log("function checkAndMake - if stat == true");
    makeTable(request);
  }else{
    console.log("function checkAndMake - if stat == true");
    table.clear();
  }
}
*/


/*
//DATATABLE
function makeTable(request){
  console.log("function makeTable");
  request.done((data,status,jqXHR) =>{
    if( $.fn.dataTable.isDataTable("#data-table") ){
      console.log("function makeTable - request.done --> destroy");
      table.destroy();
    }

    table = $("#data-table").DataTable( {
      ordering: false,
      paging: false,
      searching: false,
      data: data,
      "columns": [
        { data: "province" },
        { data: "year"},
        { data: "vacancies"},
        { data: "demand"}]
    });//DataTable
    console.log("function makeTable - DATA LEN: "+data.length);
  });//done
  request.fail(()=>{
    console.log("function makeTable - request.fail");
    if(table != undefined){    table.clear().draw();}
  });

}
*/



/*
function makeTable(request){
  console.log("MAKE TABLE")
  request.done((data,status,jqXHR) =>{

    var table = $('<table id="data-table"  class="responsive-table highlight">'); //Inicializo tabla
    var head = "<tr>";
    for (var i in data[0]){
      head = head + ("<th>"+i+"</th>");
    }
    head = head + "<tr>";
    $(head).appendTo(table);
    $.each(data, function(index, value){
      var row = "<tr>";
      $.each(value, function(key,val){
        row = row + ("<td>"+val+"</td>");
      });
      row = row + "</tr>";
      $(table).append(row);
    });
    //return ($(table));

    $(table).appendTo("#data");

  });
}
*/
