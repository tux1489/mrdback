const cronJob = require('cron').CronJob;
const Service = require('../models/service.model');
const socket = require('../socket');


let checkAppointments = () => {
    console.log('Checking for appointments... ', Date.now().toLocaleString());
    Service.list({
        status: 'appointed',
        appointment: true,
        date: { $lte: Date.now() }
    })
        .then(services => {
            console.log('Services appointed: ', services);

            services.forEach(service => {
                socket.NotifyNextDetailer(service);
            });
        })
        .catch(err => {
            console.log('There has been an error checking for appointments:');
            console.log(err);
        });
};

exports.init = () => {
    console.log('Initiate...');

    const cronTime = '*/1 * * * *';

    let job = new cronJob({
        cronTime,
        onTick: checkAppointments,
        start: true
    })
}