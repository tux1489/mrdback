const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var server = require('http').Server(app);
const config = require('./config').get(process.env.NODE_ENV);
const SECRET = config.secret;
const router = require('./routes/user.router');
const User = require('./models/user.model');
const Service = require('./models/service.model');
const PORT = 3000;
let jwt = require('jsonwebtoken');
const CTS = require('./utils/constants');
const http = require('http');

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



let io = require('socket.io')(http, {
  'pingInterval': 200,
  'pingTimeout': 10000,
  'origins': '*:*'
}).listen(server);

io.on('connection', socket => {

  socket.on('new_service', data => {
    console.log('New service request ', data);

    let { token, destination, serviceId } = data;
    if (!token)
      console.log('no token provided', token);


    jwt.verify(token, SECRET, (err, decoded) => {
      if (err || !decoded)
        console.log('token err', err, decoded);

      else {
        User.get({ _id: decoded._doc._id })
          .then(user => {
            if (!user)
              console.log('user not found');


            let newServiceAttrs = {
              customer: user._id,
              date: Date.now(),
              loc: {
                coordinates: [destination.latitude, destination.longitude]
              },
              type: CTS.SERVICES_TYPES[serviceId].title
            }

            Service.add(newServiceAttrs)
              .then(service => {

                console.log('response', {
                  service,
                  serviceID: serviceId,
                  socketID: socket.id
                });

                socket.broadcast.emit('new_detail', {
                  service,
                  serviceID: serviceId,
                  socketID: socket.id
                })
              })
              .catch(err => {
                console.log('ERROR: ', err);
              })
          })
      }
    })


  });
  socket.on('take_it', data => {
    //actualizar take_by
    //enviar notificacion al cliente

    io.to(data).emit('taken', 'diamond'); // socketid de detailer.
    socket.broadcast.emit('client_taken', { msg: 'tu mama' })
  });
  socket.on('leave_it', data => {
    console.log('leave it', data);

    //    socket.broadcast.emit('new_detail', data);
  });

  socket.on('client_cancel', data => {
    let { token, serviceID } = data;

    // actualizar status del servicio.


    // si el servicio fue  tomado chequear si esta en el tiempo establecido.
    // hacer emit al detailer que tomó el servicio.

    // si no fue tomado, broadcast a todos los detailer.
    socket.broadcast.emit('client_cancel', { serviceID });
  })
});




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