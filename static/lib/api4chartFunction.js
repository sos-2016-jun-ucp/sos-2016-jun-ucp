$(document).ready(()=>{
  var datos = [];


  var request = $.ajax({
        "type": "GET",
        "url": "/api/v1/university-indicators?apikey=read",
        async:false
      });
  request.done((data,status,jqXHR)=>{
    datos = data;
    //console.log("datos done: "+datos)
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
var datos2;
  var request4 = $.ajax({
    'type':'GET',
    'url':'/api/totals',
    async:false
  });
  request4.done((data,status,jqXHR)=>{
    datos2 = JSON.parse(data);
    //console.log('datos2: '+datos2)
});

//console.log('datos2 fuera: '+datos2)

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
console.log("categorias0 tras filter y map: "+categorias0);


//INTEGRACION
//console.log('for integracion')
for(key in datos2){
  //console.log('for integracion categoria:        '+key)
  //console.log('for integracion categoria parsed: '+parseInt(key))
  //console.log('for integracion key==parseInt(datos2): '+ parseInt(key) == parseInt(key))
  if(key == parseInt(key) && added.indexOf(key)<0){
    //console.log('añadiendo key: '+key)
    categorias0.push(key);
  }
}



categorias0.sort((a,b)=>{
  return a - b;
});//ordenamos por año, de menor a mayor
console.log("categorias0 ordenado: "+categorias0);


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
//console.log("COMUNIDADES: "+comunidades);

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


console.log('for integracion categorias')
var dat = []
var elem = {};
for(var w=0;w<categorias0.length;w++){
  //console.log('categoria: '+categorias0[w])
  dat[w] = 0;
  elem = {};
  for(key in datos2){
    if(key == parseInt(key) && key == categorias0[w]){
      dat[w] = parseInt(datos2[key]);
    }
  }
}
elem['name'] = 'Earthquake';
elem['data'] = dat;
//console.log('elemento: '+elem['data'])
valores.push(elem);

$('#api4chart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'University vacancies per autonomuos community and total number of earthquakes per year'
        },
        subtitle: {
            text: 'Source: http://www.mecd.gob.es/ and http://www.seismi.org(API)'
        },
        xAxis: {
            categories: categorias0,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Vacancies & Earthquakes'
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



});//END READY
