const User = require('../models/user.model');
const util = require('../utils/util');

exports.getNextDetailer = (req, res) => {
    User.getNextDetailer()
        .then(detailer => {
            util.okResponse(res, 200, { detailer })
        })
};

exports.updateAvailability = (req, res) => {
    let { available } = req.body;
    let { _user: user } = req.decoded;

    if (!available)
        return util.errorResponse(res, "MISSING_REQUIRED_FIELDS");

    User.update({ _id: user._id }, { $set: { 'settings.available': available } })
        .then(user => {
            return util.okResponse(res, 200, { user })
        })
        .catch(err => {
            return util.errorResponse(res, err.name, err.extra);
        })

};