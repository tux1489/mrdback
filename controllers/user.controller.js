const User = require('../models/user.model');
const util = require('../utils/util');

exports.getNextDetailer = (req, res) => {
    User.getNextDetailer()
        .then(detailer => {
            util.okResponse(res, 200, { detailer })
        })
}