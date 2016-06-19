$(document).ready(()=>{
  var datos = [];
  var datosM = [];

  var request = $.ajax({
        "type": "GET",
        "url": "/api/v1/university-indicators?apikey=read",
        async:false
      });
  request.done((data,status,jqXHR)=>{
    datos = data;
    console.log("datos done: "+datos)
    for(i=0;i<datos.length;i++){
      //console.log("Community "+i+": "+datos[i]['community']);
    }
  });//done 1
  request.fail(()=>{
    var request2 = $.ajax({
          "type": "GET",
          "url": "/api/v1/university-indicators/loadInitialData?apikey=write",
          async:false
        });
        request2.done(()=>{
          var request3 = $.ajax({
                  "type": "GET",
                  "url": "/api/v1/university-indicators?apikey=read",

                  async:false
                });
                request3.done((data,status,jqXHR)=>{
                  datos = data;
                });//done 3
        });//done 2
  });//fail

  var request = $.ajax({
        "url": '/m.php?t=Marlon+Brandon&y=&type=movie&r=json',
        async:false
      });
  request.done((data,status,jqXHR)=>{
    //console.log("charFunction2 - request.done - data: "+data);
    datosM = JSON.parse(data);
    console.log("datosM done: "+data);


  });//done api externa

  //Integracion

var added = [];
var categorias0 = datos.filter(function(da){
  //console.log("Categorias0 año: "+da['year'])
  if(added.indexOf(da['year']) < 0){
    //console.log("Categorias0 añadiendo: "+da['year'])
    added.push(da['year']);
    return true;
  }else{
    return false;
  }
}).map((elemento)=>{
    return parseInt(elemento['year']);
  });
//console.log("categorias0 tras filter y map: "+categorias0);

var categorias1 = datosM.filter(function(da){
  //console.log("Categorias0 año: "+da['year'])
  if(added.indexOf(da['year']) < 0){
    //console.log("Categorias0 añadiendo: "+da['year'])
    added.push(da['year']);
    return true;
  }else{
    return false;
  }
}).map((elem)=>{
  return parseInt(elem['year']);
});

//console.log("Categorias1 tras filter y map: "+categorias1)

categorias0 = categorias0.concat(categorias1);
//console.log("categorias0 tras concat: "+categorias0);

categorias0.sort((a,b)=>{
  return a - b;
});//ordenamos por año, de menor a mayor
console.log("categorias0 ordenado: "+categorias0);




//console.log("categorias0:::"+categorias0)

//console.log("categorias0 tras entries "+categorias0)
//console.log("categorias: "+categorias);
//console.log("antes del for de categorias")
for(j=0;j<categorias0.length;j++){
  //console.log("categorias0 "+j+": "+categorias0[j]);
}

var valores = [];
added = [];
var comunidades = datos.filter((da)=>{
  if(added.indexOf(da['community']) < 0){
    added.push(da['community']);
    return true;
  }else{
    return false;
  }
});//por cada comunidad habra un elemento de la serie. Solo se indican que comunidades hay.
comunidades = comunidades.map((da)=>{
  return da['community'];
});
added = null;
console.log("COMUNIDADES: "+comunidades);

var categorias = categorias0.entries();
for(i=0;i<comunidades.length;i++){
//console.log("dentro for comunidades: "+comunidades[i]);
var elem = {};
var data = [categorias0.length];
for(p=0;p<categorias0.length;p++){
  data[p] = 0;//array de la categoria comunidades[i] inicializado a 0
}
//console.log("Data inicializado: "+data);
var com = datos.filter((elemento)=>{
  //console.log("datos.filter - COM: "+elemento['community'])
  return elemento['community'] == comunidades[i];
});//todos los elementos de la comunidad correspondiente.
//console.log("com: "+com);

for(k=0;k<com.length;k++){//por cada elemento de esa comunidad se comprueba en q posicion del array "data" hay q poner su valor.
//console.log("dentro for com: "+com[k]['community']+" "+com[k]['year']);
  for(u=0;u<categorias0.length;u++){
    var cat = categorias.next().value;
    //console.log("dentro for categorias0 - cat: "+cat)
    //console.log("dentro for categorias0 - cat[0]: "+cat[0]+" - cat[1]: "+cat[1])
    //console.log("COM['year']: "+com[k]['year'])
    //console.log('cat[1] == com[year]): '+cat[1] == com[k]['year'])
    if(cat[1] == com[k]['year']) data[cat[0]] = com[k]['vacancies'];
  }
  categorias = categorias0.entries();
}
elem['name'] = comunidades[i];
elem['data'] = data;
//console.log("ELEMENTO: "+elem['name']+" "+elem["data"]);
valores.push(elem);
}

categorias = categorias0.entries();
for(var y=0; y< datosM.length;y++){
  var data=[categorias0.length];
  var elem = {};
  for(var v=0;v<categorias0.length;v++){
    data[v] = 0;//array de la categoria Y[i] inicializado a 0
    var cat = categorias.next().value;
    if(parseInt(datosM[y]['year']) == parseInt(cat[1])){
      data[cat[0]]=30000;//para q sea un valor mas vistoso en la grafica.
    }
  }
  categorias = categorias0.entries();
  elem['name'] = datosM[y]['title']+" "+datosM[y]['year'];
  elem['data'] = data;
  valores.push(elem);
}



  $('#api1chart').highcharts({
          chart: {
              type: 'column'
          },
          title: {
              text: 'University vacancies per autonomuos community and year/Films title related to Marlon Brando'
          },
          subtitle: {
              text: 'Source: http://www.mecd.gob.es/'
          },
          xAxis: {
              categories: categorias0,
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Vacancies'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: valores
      });



});
