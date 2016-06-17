//Inicializar módulos/
var express = require("express");
var bodyParser = require("body-parser"); //Transformar JSON a VARIABLES o viceversa
var request = require("request"); ////
var app = express();

//Puede tener 2 valores, o la variable entorno PORT o 3000
//Evaluación perezosa
var port = (process.env.PORT || 3000);
//Cada vez que llegue JSON <=> Variable
app.use(bodyParser.json());

app.listen(port, ()=>{
  console.log("Ready to go! port "+port);
});

app.use("/lib",express.static(__dirname + '/static/lib'));
app.use("/css",express.static(__dirname + '/static/css'));
app.use("/",express.static(__dirname + '/static/html'));

//ULISES JUNIO
var university = require("./backend/universityIndicators.js");

app.get("/",(req,res) => {
});

app.get("/about",(req,res) => {
});

app.get('/about/university-indicators', (req,res)=>{
  console.log("accessed to /about/university-indicators");
});

//JUNIO   Acceso a recursos API REST university-indicators
app.use('/api/v1/university-indicators', university);
