const Service = require('../schemas/services.schema');

exports.add = (attrs) => {
    return new Promise((resolve, reject) => {
        let newService = new Service(attrs);

        newService.save()
            .then(service => {
                Service.populate(service, { path: 'customer', select: 'profile.name profile.phone' },
                    (err, service) => {
                        if (err)
                            reject(err)
                        else
                            resolve(service)
                    }
                )
            })
            .catch(err => reject({ name: "INTERNAL_ERROR", extra: err }))
    });
};