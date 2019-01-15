const app = require('express')();
const bodyParser = require('body-parser');
const user = require('./routes/user.route');
const mongoose = require('mongoose');
var server = require('http').Server(app);
var io = require('socket.io')(server);
let authCtrl = require('./controllers/auth.controller')
const config = require('./config').get(process.env.NODE_ENV);
const PORT = 3000;


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
  next();
});

//DATABASE CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true });
// connect to our database
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

app.get('/checking', function (req, res) {
  res.json({
    "Working": "Working Fine"
  });
});

app.post('/signup', authCtrl.signup);
app.post('/signin', authCtrl.signin);
app.post('/oauth/facebook', authCtrl.accountsFacebook);
app.post('/oauth/google', authCtrl.accountsGoogle);

server.listen(process.env.PORT || 3000);

io.on('connection', socket => {
  socket.on('new_service', data => {
    const new_data = {
      socketID: socket.id,
      latitude: data.destination.latitude,
      longitude: data.destination.longitude,
      serviceID: data.serviceId
    }
    socket.broadcast.emit('new_detail', new_data);
  });
  socket.on('take_it', data => {
    io.to(data).emit('taken', 'diamond');
  });
  socket.on('leave_it', data => {
    socket.broadcast.emit('new_detail', data);
  });
});
