const jwt = require('jsonwebtoken');
const User = require('./models/user.model');
const Service = require('./models/service.model');
const config = require('./config').get(process.env.NODE_ENV);
const SECRET = config.secret;
const authMid = require('./middlewares/auth.middleware');
const CTS = require('./utils/constants');

exports.events = (io) => {
    io.on('connection', socket => {

        socket.on('join', data => {
            let token = data.token;
            console.log('join', token);


            authMid.decodeToken(token)
                .then(decoded => {
                    socket.leave(decoded._user._id);
                    socket.join(decoded._user._id);
                    io.to(decoded._user._id).emit({ message: 'Joined' });
                    console.log('joined');

                })
                .catch(err => {

                    socket.emit('join', { error: err })
                });
        });
        socket.on('new_service', data => {
            console.log('New service request ', data);

            let { token, destination, serviceId } = data;
            let response = {}

            authMid.decodeToken(token)
                .then(decoded => {

                    let newServiceAttrs = {
                        customer: decoded._user._id,
                        date: Date.now(),
                        loc: {
                            coordinates: [destination.latitude, destination.longitude]
                        },
                        type: CTS.SERVICES_TYPES[serviceId].title
                    }

                    return Service.add(newServiceAttrs);
                })
                .then(service => {
                    response = {
                        service,
                        serviceID: serviceId,
                        socketID: socket.id
                    }

                    return User.getNextDetailer();
                })
                .then(detailer => {
                    return User.update({ _id: detailer._id }, {
                        $set: { last_service_recived: Date.now() }
                    })
                })
                .then(detailer => {
                    console.log('detailer id: ', detailer._id);
                    console.log(response);

                    io.to(detailer._id).emit('new_detail', response);
                })
                .catch(err => {
                    socket.emit('new_service', { error: err });
                });
        });
        socket.on('take_it', data => {

            let { _id: serviceID, socketID, token } = data;

            authMid.decodeToken(token)
                .then(decoded => {
                    return Service.update({ _id: serviceID }, {
                        $set: { take_by: decoded._user._id, status: 'taken' }
                    })
                })
                .then(service => {
                    io.to(service.customer).emit('taken', { service });
                    socket.emit('take_it', { service, success: true })
                })
                .catch(err => {
                    socket.emit('take_it', { error: err })
                });
        });

        socket.on('leave_it', data => {
            let { token, service } = data;

            authMid.decodeToken(token)
                .then(decoded => {
                    return User.update({ _id: decoded._user._id }, { $inc: { cancelled_services: 1 } })
                })
                .then(result => {
                    return User.getNextDetailer();
                })
                .then(detailer => {
                    return User.update({ _id: detailer._id }, {
                        $set: { last_service_recived: Date.now() }
                    })
                })
                .then(detailer => {
                    console.log('detailer id: ', detailer._id);
                    console.log(response);

                    io.to(detailer._id).emit('new_detail', { service, serviceID: 0, socketID: service.customer });
                })
                .catch(err => {
                    socket.emit('leave_it', { error: err });
                })
        });
        socket.on('client_cancel', data => {
            let { token, serviceID } = data;

            authMid.decodeToken(token)
                .then(decoded => {
                    return Service.update({ _id: serviceID, customer: decoded._user._id }, { $set: { status: 'cancelled' } }, false)
                })
                .then(service => {
                    if (service.take_by) {
                        io.to(take_by).emit('cancelled_service', { service });
                        throw 'err'
                    }
                    else
                        console.log('lq');

                    //  return User.getNextDetailer();
                })
                .then(detailer => {

                })
                .catch(err => { console.log(err) })

            // actualizar status del servicio.


            // si el servicio fue  tomado chequear si esta en el tiempo establecido.
            // hacer emit al detailer que tomó el servicio.

            // si no fue tomado, broadcast a todos los detailer.
            socket.broadcast.emit('client_cancel', { serviceID });
        })
    });
}


