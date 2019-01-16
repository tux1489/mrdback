const CTS = require('../utils/constants');
const util = require('../utils/util');

exports.constants = (req, res) => {
    return util.okResponse(res, 200, {
        services_types: CTS.SERVICES_TYPES,
        errors: CTS.ERRORS
    })
}