$(document).ready(()=>{
  var datos = [];
  var values = [];
  var categorias = [];

var request = $.ajax({
  'type':'GET',
  'url':'/1.0/population/2015/Cameroon'
});
request.done((data,status,jqXHR)=>{
  datos = data;
  console.log("charFunction3 - request.done - datos.len: "+datos.length);
  console.log("charFunction3 - request.done - data.len: "+data.length);


  console.log('datos.len antes del for: '+datos.length)
  for(var i = 0;i<datos.length;i++){
    var array = [datos.length];
    for(var p=0;p<datos.length;p++){
      array[p] = 0;
    }
    var elem = {};
    elem['name'] = 'Age: '+i;
    categorias.push(i);
    //console.log('categoria: '+i)
    array[i] = datos[i]['total'];
    //console.log('dato: '+i+'[total]: '+datos[i]['total'])
    elem['data'] = array;
    //console.log('array: '+array)
    values.push(elem);
  }


    $('#api3chart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Number of people in a range [0,100] in Cameroon'
            },
            subtitle: {
                text: 'Source: http://api.population.io/1.0/population/2015/Cameroon'
            },
            xAxis: {
                categories: categorias,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Amount of people'
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
            series: values
        });


});//done api externa

console.log('categorias: '+categorias)
console.log('values: '+values)





});//READY
