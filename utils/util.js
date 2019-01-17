const CTS = require('./constants');

exports.okResponse = (res, httpCode, response) => {
    return res.status(httpCode).json(
        response
    )
}
exports.errorResponse = (res, id, extra) => {
    var error = CTS.ERRORS[id];
    error = error ? error : CTS.DEFAULT_ERROR;

    return res.status(error.httpCode).json({
        error: {
            id: id,
            code: error.code,
            description: error.description,
            extra: extra
        }
    })
}

exports.isEmail = (email) => {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}