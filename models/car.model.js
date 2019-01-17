let Car = require('../schemas/cars.schema');

exports.add = (attrs) => {
    return new Promise((resolve, reject) => {
        let newCar = new Car(attrs);
        newCar.save()
            .then(car => resolve(car))
            .catch(err => reject(err))
    })
}

exports.list = (match) => {
    return new Promise((resolve, reject) => {
        Car.find(match)
            .then(cars => resolve(cars))
            .catch(err => reject(err))
    })
}

exports.delete = (match) => {
    return new Promise((resolve, reject) => {
        Car.remove(match)
            .then(() => resolve())
            .catch(err => {
                reject(err);
            });
    })
}

exports.get = (match) => {
    return new Promise((resolve, reject) => {
        Car.findOne(match)
            .then(cars => resolve(cars))
            .catch(err => reject(err))
    })
}

exports.update = (match, set) => {
    return new Promise((resolve, reject) => {
        Car.update(match, set)
            .then(result => resolve(result))
            .catch(err => reject(err))
    })

}