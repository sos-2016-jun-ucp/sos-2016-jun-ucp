
/*
//-implementar borrado de elemento aislado.
//-div log en la guion
//-llamadas sincronas y asincronas
//-respuestas bad request en lugar de 401 y 403
//-widget aspecto GUI
-funcion update() no hace request de todos los elementos una vez hecha request para PUT.
-cuando se hace get sobre tabla vacia, checkStatus() no ejecuta correctamente.
-cambiar apikey por la de governify en todos los archivos.
*/


//Inicializar módulos/
var express = require("express");
var bodyParser = require("body-parser"); //Transformar JSON a VARIABLES o viceversa
var request = require("request");
var app = express();
var cors = require("cors");
var university = require("./backend/universityIndicators.js");
var governify = require("governify");

//Puede tener 2 valores, o la variable entorno PORT o 3000
//Evaluación perezosa
var port = (process.env.PORT || 3000);
//Cada vez que llegue JSON <=> Variable
app.use(bodyParser.json());
app.use(cors());//middleware con maximo nivel de apertura

app.listen(port, ()=>{
  console.log("Ready to go! port "+port);
});

////SLA
/*
governify.control(app,{
  datastore: "",
  namespace: "",
  defaultPath: "/api/v1/university-indicators"
});
////FIN SLA
*/


//PROXY 1 INTEGRADO
var proxy1 = '/m.php';//importante no poner simbolo ?
var apiUrl1 = 'https://moviesapi.com';
app.use(proxy1, function(req, res) {
  var url = apiUrl1 + req.baseUrl + req.url;
  console.log('piped: '+req.baseUrl + req.url);
  console.log('URL accesed: '+url);

  req.pipe(request(url,(error,response,body)=>{
    if(error){//para evitar que se caiga el server si hay algun error.
      console.error(error);
      res.sendStatus(503); //Servicio NO disponible
    }
  })).pipe(res);
});

//PROXY 2 - USO SIN WIDGET
var proxy2 = '/books/v1/volumes';
var serverUrl2 = 'https://www.googleapis.com';
app.use(proxy2, function(req, res) {
  var url = serverUrl2 + req.baseUrl + req.url;
  console.log('URL proxy2 - SIN WIDGET: '+url);
  req.pipe(request(url,(error,response,body)=>{
    if(error){//para evitar que se caiga el server si hay algun error.
      console.error(error);
      res.sendStatus(503); //Servicio NO disponible
    }
  })).pipe(res);
});//FIN PROXY2

//PROXY 3 - INTEGRACION
var proxy3 = '/1.0/population/2015/Cameroon';
var serverUrl3 = 'http://api.population.io';
app.use(proxy3, function(req, res) {
  var url = serverUrl3 + req.baseUrl + req.url;
  console.log('URL proxy3: '+url);
  req.pipe(request(url,(error,response,body)=>{
    if(error){//para evitar que se caiga el server si hay algun error.
      console.error(error);
      res.sendStatus(503); //Servicio NO disponible
    }
  })).pipe(res);
});//FIN PROXY3


//PROXY 4 - WIDGET AISLADO
var proxy4 = '/api/totals';
var serverUrl4 = 'http://www.seismi.org';
app.use(proxy4, function(req, res) {
  var url = serverUrl4 + req.baseUrl + req.url;
  console.log('URL proxy4: '+url);
  req.pipe(request(url,(error,response,body)=>{
    if(error){//para evitar que se caiga el server si hay algun error.
      console.error(error);
      res.sendStatus(503); //Servicio NO disponible
    }
  })).pipe(res);
});//FIN PROXY4




app.use("/lib",express.static(__dirname + '/static/lib'));
app.use("/css",express.static(__dirname + '/static/css'));
app.use("/",express.static(__dirname + '/static/html'));




app.get("/",(req,res) => {
});

app.get("/about",(req,res) => {
});

app.get('/about/university-indicators', (req,res)=>{
  console.log("accessed to /about/university-indicators");
});

//JUNIO   Acceso a recursos API REST university-indicators
app.use('/api/v1/university-indicators', university);
