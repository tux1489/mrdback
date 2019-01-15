const Car = require('../models/car.model')
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