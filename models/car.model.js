let Car = require('../schemas/cars.schema');

exports.add = (attrs) => {
    return new Promise((resolve, reject) => {
        let newCar = new Car(attrs);
        newCar.save()
            .then(car => resolve(car))
            .catch(err => reject(err))
    })
}