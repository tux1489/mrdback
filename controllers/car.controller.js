const Car = require('../models/car.model')
const User = require('../models/user.model')
let util = require('../utils/util')

exports.add = (req, res) => {
    let { model, serial, color } = req.body;
    let { _id: customer } = req.decoded._doc;

    if (!model || !serial || !color)
        return util.errorResponse(res, "MISSING_REQUIRED_FIELDS")

    Car.add({ model, serial, color, customer })
        .then(car => {
            return util.okResponse(res, 201, { car })
        })
        .catch(err => {
            return util.errorResponse(res, err.name, err.extra)
        })
}

exports.list = (req, res) => {
    let { _id: customer } = req.decoded._doc

    Car.list({ customer })
        .then(cars => {
            return util.okResponse(res, 200, { cars })
        })
        .catch(err => {
            return util.errorResponse(res, err.name, err.extra)
        })
}

exports.remove = (req, res) => {
    let carID = req.body.id;
    let userID = req.decoded._doc._id;

    if (!carID)
        return util.errorResponse(res, "MISSING_REQUIRED_FIELDS");

    Car.delete({ _id: carID, customer: userID })
        .then(() => {
            return util.okResponse(res, 201, { msg: "Success" });
        })
        .catch(err => {
            return util.errorResponse(res, err.name, err.extra);
        });
}

exports.setFavorite = (req, res) => {
    let carID = req.body.id;
    let userID = req.decoded._doc._id;

    if (!carID)
        return util.errorResponse(res, "MISSING_REQUIRED_FIELDS");

    Car.get({ _id: carID })
        .then(car => {
            if (!car)
                throw { name: "NOT_FOUND" }
            else
                return User.update({ _id: userID }, { $set: { 'settings.favorite_car': carID } });
        })
        .then(user => {
            return util.okResponse(res, 200, { settings: user.settings });
        })
        .catch(err => { return util.errorResponse(res, err.name, err.extra) });
}