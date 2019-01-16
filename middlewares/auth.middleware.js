let jwt = require('jsonwebtoken'),
    config = require('../config').get(process.env),
    SECRET = config.secret,
    User = require('../models/user.model'),
    util = require('../utils/util');

exports.authenticate = (req, res, next) => {

    let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, SECRET, function (err, decoded) {
            if (err || !decoded) {
                return util.errorResponse(res, 'AUTHENTICATE_FAILED', err);
            } else {
                User.get({ _id: decoded._doc._id })
                    .then(user => {
                        if (user) {
                            req.decoded = decoded;
                            next();
                        }
                        else
                            return util.errorResponse(res, "AUTHENTICATE_FAILED");
                    })
                    .catch(err => {
                        return util.errorResponse(res, "AUTHENTICATE_FAILED", err);
                    });
            }
        });
    } else {
        return util.errorResponse(res, 'NO_TOKEN_PROVIDED');
    }
}