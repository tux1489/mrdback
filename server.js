const app = require('express')();
const bodyParser = require('body-parser');
const user = require('./routes/user.route');
const mongoose = require('mongoose');
var server = require('http').Server(app);
var io = require('socket.io')(server);

mongoose.connect('mongodb://localhost/jwtauth', { useNewUrlParser: true });

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/checking', function(req, res){
   res.json({
      "Working": "Working Fine"
   });
});

app.use('/user', user);

server.listen(3000);

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
    io.to(data).emit('taken','diamond');
  });
  socket.on('leave_it', data => {
    socket.broadcast.emit('new_detail', data);
  });
});
