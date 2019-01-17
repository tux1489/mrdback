const User = require('../models/user.model')
const authMid = require('../middlewares/auth.middleware')
const CTS = require('../utils/constants')
let util = require('../utils/util')
let https = require('https');


exports.signin = (req, res) => {

    let {
        email,
        password
    } = req.body;

    console.log(req.body);

    if (!email || !password)
        //Some required field is missing
        return util.errorResponse(res, 'MISSING_REQUIRED_FIELDS');


    User.signin(email, password)
        .then(user => {
            //User was successfully signed in.
            //Return user info.

            let _doc = {
                _id: user._id,
                ustype: user.ust
            };

            let response = { user }

            // If user is not owner, add just the token to response object.
            response.token = authMid.generateToken({ _doc }, CTS.TOKEN_EXPIRES_IN);
            return util.okResponse(res, 201, response);
        })
        .catch(err => {
            //Some error ocurred. 
            //Return error info.
            return util.errorResponse(res, err.name, err.extra);
        });
}

exports.signup = (req, res) => {
    let { email,
        password,
        phone,
        name,
        age,
        ustype = 'customer' } = req.body;

    if (!email
        || !password
        || !phone
        || !name
        || !age)
        return util.errorResponse(res, "MISSING_REQUIRED_FIELDS")

    let profile = { name, phone, age };
    let _doc;

    User.signup(email, password, profile, ustype)
        .then(user => {
            if (user) {
                let response = { user };
                _doc = {
                    _id: user._id,
                    ustype
                }

                response.token = authMid.generateToken({ _doc }, CTS.TOKEN_EXPIRES_IN);
                return util.okResponse(res, 201, response)
            }


        })
        .catch(err => {
            return util.errorResponse(res, err.name, err.extra)
        })
}

exports.accountsFacebook = (req, res) => {
    let token = req.body.token;

    if (!token)
        return util.errorResponse(res, 'MISSING_REQUIRED_FIELDS');

    let url = "https://graph.facebook.com/me?access_token=" + token + "&fields=id,first_name,last_name,email";
    https.get(url, (resp) => {
        resp.on("data", (d) => {
            let response = JSON.parse(d.toString());
            if (response.error)
                return util.errorResponse(res, 'FACEBOOK_ERROR', err);

            if (!response.first_name || !response.last_name || !response.email)
                return util.errorResponse(res, 'FACEBOOK_FIELDS_AUTHENTICATE');


            return User.get({
                email: response.email
            })
                .then(user => {
                    if (user) {
                        return user;
                    } else {
                        return User.add({
                            email: response.email,
                            profile: {
                                name: `${response.first_name} ${response.last_name}`
                            },
                            ustype: 'customer'
                        })
                    }
                })
                .then(user => {
                    let _doc = {
                        _id: user._id,
                        ustype: user.ustype
                    }
                    return util.okResponse(res, 200, { user, token: authMid.generateToken({ _doc }, CTS.TOKEN_EXPIRES_IN) })
                })
                .catch(err => {
                    return util.errorResponse(res, err.name, err.extra)
                })

        })
    });
}

exports.accountsGoogle = (req, res) => {
    let token = req.body.token;
    console.log(req.body);


    if (!token)
        return util.errorResponse(res, 'MISSING_REQUIRED_FIELDS');

    let url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + token
    https.get(url, (resp) => {
        resp.on("data", (d) => {
            let response = JSON.parse(d.toString());

            if (response.error)
                return util.errorResponse(res, 'GOOGLE_ERROR');

            if (!response.name || !response.email)
                return util.errorResponse(res, 'GOOGLE_FIELDS_AUTHENTICATE');


            return User.get({
                email: response.email
            })
                .then(user => {
                    if (user) {
                        return user;
                    } else {
                        return User.add({
                            email: response.email,
                            profile: {
                                name: response.name
                            },
                            ustype: 'customer'
                        })
                    }
                })
                .then(user => {
                    let _doc = {
                        _id: user._id,
                        ustype: user.ustype
                    }
                    return util.okResponse(res, 200, { user, token: authMid.generateToken({ _doc }, CTS.TOKEN_EXPIRES_IN) })
                })
                .catch(err => {
                    return util.errorResponse(res, err.name, err.extra)
                })

        })
    });
}