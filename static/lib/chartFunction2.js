$(document).ready(()=>{
  var datos = [];
  var request = $.ajax({
        "type": "GET",
        "url": "/api/v1/university-indicators?apikey=read",
        async:false
      });
  request.done((data,status,jqXHR)=>{
    //console.log("charFunction2 - request.done - data: "+data);
    datos = data;
    //console.log("datos done: "+datos)
    for(i=0;i<datos.length;i++){
      console.log("Community "+i+": "+datos[i]['community']);
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

var samples = [];
  for(key in datos){
    var header = datos[key]['community']+" "+datos[key]['year'];
    //console.log("header "+key+": "+header);
    if(samples.indexOf(header) === -1){
      samples.push(header);
    }
  }
  //console.log("samples: ");
  //console.log(samples);
  //console.log("datos "+datos)//muestra array de 10 arrays de 2 objetos, imposible.

  var n = 2, // number of layers
      m = samples.length, // number of samples per layer
      stack = d3.layout.stack(),
      //layers = stack(d3.range(n).map(function() { return bumpLayer(m, .1); }));
      //no permite aplicar la funcion map al array datos, sin sentido.
       layers = stack(datos.map(function(da){
          return {x:da['community']+" "+da['year'],y:da['vacancies']};
        }));

      console.log("layers: "+layers);
      yGroupMax = d3.max(layers, function(layer) { console.log("layer: "+layer);return d3.max(layer, function(d) { console.log("layer D: "+d);return d.y; }); }),
      yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });



      function preparaDatos(samples, datos, m){
        var array = [];


      }

      // Inspired by Lee Byron's test data generator.
      function bumpLayer(n, o) {

        function bump(a) {
          var x = 1 / (.1 + Math.random()),
              y = 2 * Math.random() - .5,
              z = 10 / (.1 + Math.random());
          for (var i = 0; i < n; i++) {
            var w = (i / n - y) * z;
            a[i] += x * Math.exp(-w * w);
          }
        }

        var a = [], i;
        for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
        for (i = 0; i < 5; ++i) bump(a);
        //console.log("bumpLayer - i: "+i);
        return a.map(function(d, i) {
        //console.log("bumpLayer - a.map - i: "+i);
        //console.log("bumpLayer - a.map - d: "+d);
        return {x: i, y: Math.max(0, d)};
      });
      }

//tamanño del widget
  var margin = {top: 40, right: 10, bottom: 20, left: 10},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  var x = d3.scale.ordinal()
      .domain(d3.range(m))
      .rangeRoundBands([0, width], .05);//ancho de las barras


  var y = d3.scale.linear()
      .domain([0, yStackMax])
      .range([height, 0]);


  var color = d3.scale.linear()
      .domain([0, n])//contraste de las barras
      .range(["#aad", "#556"]);


//no imprescindible
  var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)//suelo de la grafico, grosor
      .tickPadding(6)//separacion entre las barras
      .orient("bottom");

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var layer = svg.selectAll(".layer")
      .data(layers)
    .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

  var rect = layer.selectAll("rect")
      .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0);

  //No imprescindible
  rect.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

//No imprescindible, coloca los nomrbes bajo las barras
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
//No imprescindible
  d3.selectAll("input").on("change", change);

//No imprescindible, hace la transicion
  var timeout = setTimeout(function() {
    d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
  }, 2000);

//No imprescindible, hace la transicion
  function change() {
    clearTimeout(timeout);
    if (this.value === "grouped") transitionGrouped();
    else transitionStacked();
  }

  function transitionGrouped() {
    y.domain([0, yGroupMax]);

    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
        .attr("width", x.rangeBand() / n)
      .transition()
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });
  }

  function transitionStacked() {
    y.domain([0, yStackMax]);

    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
      .transition()
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand());
  }




});//DOCUMENT READY
