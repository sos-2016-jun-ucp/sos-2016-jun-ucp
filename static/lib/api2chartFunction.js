$(document).ready(()=>{

  var datos = [];

  var request4 = $.ajax({
    'type':'GET',
    'url':'/books/v1/volumes?q=andalucia',
    async:false
  });
  request4.done((data,status,jqXHR)=>{
    console.log("charFunction2 - request.done - data: "+data);
    //datos = JSON.parse(data);//error parsing to jSON
    //$('#api2chart').text(datos);
  });//done api externa



});//FIN READY
