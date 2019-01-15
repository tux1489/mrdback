let User = require('../schemas/user.schema'),
    util = require('../utils/util');

const CTS = require('../utils/constants')

exports.add = (atrrs) => {
    return new Promise((resolve, reject) => {
        if (!atrrs)
            throw { name: "MISSING_REQUIRED_FIELDS" }

        let newUser = new User(atrrs)
        newUser.save()
            .then(user => resolve(user))
            .catch(err => reject(err))
    })
}

exports.get = (match) => {
    return User.findOne(match)
}

exports.signin = (login, password, imei = "") => {
    return new Promise((resolve, reject) => {

        //Check required fields.
        if (!login || !password) {
            //Some required field is missing
            throw {
                name: "MISSING_REQUIRED_FIELDS"
            };
        }

        let match = {},
            user;

        if (util.isEmail(login))
            match.email = login.toLowerCase()
        else
            match.username = login.replace(/\s/g, '').toLowerCase();

        //Find the user in Database
        User.findOneAndUpdate(match, { $set: { imei } })
            .then(result => {
                user = result;

                if (!user) {
                    throw {
                        name: "BAD_CREDENTIALS"
                    };
                }

                //User found.
                //Check if passwords match
                return user.comparePassword(password)
            })
            .then(match => {
                if (!match) {
                    //Password doesn't match
                    throw {
                        name: "BAD_CREDENTIALS"
                    };
                }

                resolve(user);
            })
            .catch(err => {
                return reject({
                    name: "INTERNAL_ERROR",
                    extra: err
                });
            });
    });
}

exports.signup = (email, password, profile, ustype) => {
    return new Promise((resolve, reject) => {

        if (!email || !password) {
            throw {
                name: "MISSING_REQUIRED_FIELDS"
            };
        }

        email = email.toLowerCase();

        //Check if user already exists
        User.findOne({ email })
            .then(user => {
                if (user) {
                    throw {
                        name: "USER_ALREADY_EXIST"
                    };
                }

                if (password.length < CTS.MIN_PASSWORD_LENGTH) {
                    //Error, password too short
                    return reject({
                        name: "PASSWORD_TOO_SHORT"
                    });
                }

                //Create the new user
                let newUser = new User({
                    email,
                    password,
                    profile,
                    ustype
                });

                //Save it in Database
                return newUser.save();
            })
            .then(user => {
                //User was created. Return user info without unnecesary fields
                resolve(user);
            })
            .catch(err => {
                //Some error ocurred. 
                //Return the error info.
                reject(err);
            });
    });
}