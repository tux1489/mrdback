const User = require('./models/user.model');
const Service = require('./models/service.model');
const authMid = require('./middlewares/auth.middleware');
const CTS = require('./utils/constants');

let io;

exports.events = (_io) => {

    io = _io;

    io.on('connection', socket => {
        socket.on('join', data => {
            let token = data.token;
            console.log('join', token);

            authMid.decodeToken(token)
                .then(decoded => {
                    socket.leave(decoded._user._id);
                    socket.join(decoded._user._id);
                    io.to(decoded._user._id).emit({ message: 'Joined' });
                    console.log('joined ', decoded._user._id);

                })
                .catch(err => {
                    socket.emit('join', { error: err })
                });
        });
        socket.on('new_service', data => {

            let { token, destination, serviceId, carID = null, appointment = false, date } = data;
            let response = {}

            if (!token || !destination || !serviceId || carID)
                socket.emit('new_service', { error: { name: "MISSING_REQUIRED_FIELDS" } });

            authMid.decodeToken(token)
                .then(decoded => {

                    let newServiceAttrs = {
                        customer: decoded._user._id,
                        car: carID,
                        appointment,
                        loc: {
                            coordinates: [destination.latitude, destination.longitude]
                        },
                        type: CTS.SERVICES_TYPES[serviceId].title
                    }

                    newServiceAttrs.date = appointment ? date : Date.now();
                    newServiceAttrs.status = appointment ? 'appointed' : 'pending';

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
                    console.log('service created: ', response.service);
                    console.log('detailer: ', detailer.profile.name);

                    io.to(detailer._id).emit('new_detail', response);
                    socket.emit('new_service', response)
                })
                .catch(err => {
                    socket.emit('new_service', { error: err });
                });
        });
        socket.on('take_it', data => {

            let { _id: serviceID, token } = data;

            authMid.decodeToken(token)
                .then(decoded => {
                    return User.update({ _id: decoded._user._id }, { $set: { 'settings.available': false } });
                })
                .then(detailer => {
                    return Service.update({ _id: serviceID }, {
                        $set: { take_by: detailer._id, status: 'taken' }
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
                    //  detailerId = decoded._user._id;
                    return User.getNextDetailer();
                })
                .then(detailer => {
                    return User.update({ _id: detailer._id }, {
                        $set: { last_service_recived: Date.now(), 'settings.available': true }
                    })
                })
                .then(detailer => {
                    console.log('leave it', detailer.profile.name);

                    io.to(detailer._id).emit('new_detail', { service, serviceID: 0, socketID: service.customer });
                })
                .catch(err => {
                    socket.emit('leave_it', { error: err });
                })
        });
        socket.on('client_cancel', data => {
            let { token, service } = data;
            console.log('El cliente canceló el servicio: ', service);

            let timePassed = (Date.now() - (new Date(service.date))) / 60000;
            console.log(timePassed);

            if (timePassed >= 10)
                service.comission = true;

            authMid.decodeToken(token)
                .then(decoded => {
                    return Service.update({ _id: service._id, customer: decoded._user._id }, { $set: { status: 'discarded' } }, false)
                })
                .then(service => {

                    if (service.take_by) {
                        io.to(service.take_by._id).emit('cancelled_service', { service });
                    }
                    socket.emit('client_cancel', { success: true });
                    return User.update({ _id: service.take_by }, { $set: { 'settings.available': true } })
                })
                .then(detailer => {
                    console.log('ok', detailer);

                })
                .catch(err => { socket.emit('client_cancel', { success: false, error: err }); })
        });
        socket.on('detailer_cancel', data => {
            console.log('solicitud de cancelacicón recibida.');

            let { token, service } = data;
            let detailerID;

            authMid.decodeToken(token)
                .then(decoded => {
                    detailerID = decoded._user._id;
                    return Service.update({ _id: service._id, take_by: decoded._user._id }, { $set: { status: 'cancelled' } });
                })
                .then(upService => {
                    service = upService;
                    return User.update({ _id: detailerID }, { $inc: { cancelled_services: 1 }, $set: { 'settings.available': true } })
                })
                .then(detailer => {
                    if (detailer.cancelled_services >= 5)
                        service.comission = true;

                    console.log('Detailer cancel a service: ', service);

                    io.to(service.customer).emit('cancelled_service', { success: true, service }) // Notify client
                    io.to(service.take_by).emit('cancelled_service', { success: true, service }) // Notify detailer
                })

        });
    });
}

exports.NotifyNextDetailer = NotifyNextDetailer = (service) => {
    User.getNextDetailer()
        .then(detailer => {
            return User.update({ _id: detailer._id }, {
                $set: {
                    last_service_recived: Date.now(),
                    'settings.available': false
                }
            });
        })
        .then(detailer => {
            io.to(detailer._id).emit('new_detail', { service, serviceID: 0, socketID: 'aa' });
            io.to(service.customer).emit('new_service', { service, serviceID: 0, socketID: 'aa' });
        })
        .catch(err => {
            console.log(' error: ', err);
            io.to(service.customer).emit('new_service', { error: err });
        })
}


