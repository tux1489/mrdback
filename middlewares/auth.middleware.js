let jwt = require('jsonwebtoken'),
    config = require('../config').get(process.env),
    SECRET = config.secret,
    User = require('../models/user.model'),
    util = require('../utils/util');



exports.generateToken = generateToken = (doc, expiresIn) => {
    return jwt.sign(doc, SECRET, {
        expiresIn: expiresIn
    });
}

exports.decodeToken = decodeToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token)
            return reject({ name: "NO_TOKEN_PROVIDED" });

        jwt.verify(token, SECRET, (err, decoded) => {

            if (err || !decoded || !decoded._doc._id)
                return reject({ name: "Token err" });
            else {
                User.get({ _id: decoded._doc._id })
                    .then(user => {
                        decoded._user = user;
                        resolve(decoded);
                    })
                    .catch(err => reject(err));
            }
        })
    })
}

exports.authenticate = (req, res, next) => {
    console.log(req.body);
    console.log('headers', req.headers);

    let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
        decodeToken(token)
            .then(decoded => {
                console.log(' decodificado');

                req.decoded = decoded;
                next();
            })
            .catch(err => {
                console.log(err);

                return util.errorResponse(res, "AUTHENTICATE_FAILED");
            });
    } else {
        return util.errorResponse(res, 'NO_TOKEN_PROVIDED');
    }
}