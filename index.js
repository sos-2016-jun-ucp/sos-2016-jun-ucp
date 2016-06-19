
/*
//-implementar borrado de elemento aislado.
//-div log en la guion
//-llamadas sincronas y asincronas
//-respuestas bad request en lugar de 401 y 403
//-widget aspecto GUI
-funcion update() no hace request de todos los elementos una vez hecha request para PUT.
-cuando se hace get sobre tabla vacia, checkStatus() no ejecuta correctamente.
*/


//Inicializar módulos/
var express = require("express");
var bodyParser = require("body-parser"); //Transformar JSON a VARIABLES o viceversa
var request = require("request"); ////
var app = express();
var cors = require("cors");
var university = require("./backend/universityIndicators.js");

//Puede tener 2 valores, o la variable entorno PORT o 3000
//Evaluación perezosa
var port = (process.env.PORT || 3000);
//Cada vez que llegue JSON <=> Variable
app.use(bodyParser.json());
app.use(cors());//middleware con maximo nivel de apertura

app.listen(port, ()=>{
  console.log("Ready to go! port "+port);
});


//PROXY 1
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

//PROXY 2
var proxy2 = '';
var serverUrl2 = '';
app.use(proxy2, function(req, res) {
  var url = serverUrl2 + req.baseUrl + req.url;
  console.log('URL proxy2: '+url);

  req.pipe(request(url,(error,response,body)=>{
    if(error){//para evitar que se caiga el server si hay algun error.
      console.error(error);
      res.sendStatus(503); //Servicio NO disponible
    }
  })).pipe(res);
});//FIN PROXY2


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
