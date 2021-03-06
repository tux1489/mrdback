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
        User.findOneAndUpdate(match, { $set: { imei, 'settings.available': true } }, { new: true })
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

exports.update = (match, set) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate(match, set, { new: true })
            .then(user => {
                if (!user)
                    return reject({ name: "USER_NOT_FOUND" });
                else
                    resolve(user);
            })
            .catch(err => reject(err));
    })
}

exports.getNextDetailer = () => {
    return new Promise((resolve, reject) => {
        User.find({ ustype: 'detailer', 'settings.available': true })
            .sort({ last_service_recived: 1 })
            .then(detailers => {
                console.log('detailers', detailers[0]);

                if (detailers[0])
                    resolve(detailers[0])
                else
                    reject({ name: "NO_DETAILERS_AVAILABLE" });
            })
            .catch(err => reject(err))

    })
}