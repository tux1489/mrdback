const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config').get(process.env.NODE_ENV);
const router = require('./routes/user.router');
const PORT = 3000;
const http = require('http');
const socket = require('./socket');
var server = require('http').Server(app);


// OPTIONS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
  next();
});

//DATABASE CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + config.database);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTER
router(app);

server.listen(process.env.PORT || PORT);

// SOCKET 
let io = require('socket.io')(http, {
  'pingInterval': 200,
  'pingTimeout': 10000,
  'origins': '*:*'
}).listen(server);

socket.events(io);


/* NOTES:

- EL cliente debe confirmar cuando el detailer llegó.
- Se tiene que mostrar el tiempo aprox de llegada.
- Se debe mostrar contador del tiempo estimado por tipo de servicio.
- Se debe contemplar que el detailer no llega.
- Se debe mostrar el telefono del detailer cuando no ha llegado.
- Se debe mostrar la opción de: Cancelar servicio, volver a solicitar servicio, agendar servicio.
- Se le cobra al detailer un fee cuando cancelan el servicio porque no llegó o va retrasado.
- Que el cliente pida otro servicio con el mismo detailer en el mismo lugar.
- Puede pedir varios paralelamente para distitos autos.

*/