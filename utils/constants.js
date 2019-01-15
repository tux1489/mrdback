exports.MIN_PASSWORD_LENGTH = 6;
exports.TOKEN_EXPIRES_IN = '365d'

exports.ERRORS = {
    "INTERNAL_ERROR": {
        httpCode: 400,
        code: "#-1"
    },
    "NOT_FOUND": {
        httpCode: 404,
        code: '#-2'
    },
    "MISSING_REQUIRED_FIELDS": {
        httpCode: 400,
        code: "#1001"
    },
    "USER_ALREADY_EXIST": {
        httpCode: 403,
        code: "#1002"
    },
    "PASSWORD_TOO_SHORT": {
        httpCode: 400,
        code: "#1004"
    },
    "USER_DOESNT_EXIST": {
        httpCode: 404,
        code: "#1005"
    },
    "BAD_CREDENTIALS": {
        httpCode: 403,
        code: "#1006"
    },
    "NO_TOKEN_PROVIDED": {
        httpCode: 403,
        code: "#1008"
    },
    "AUTHENTICATE_FAILED": {
        httpCode: 401,
        code: "#1009"
    },
    "UNAUTHORIZATED": {
        httpCode: 401,
        code: "#1011"
    },
    "PARAMETER_IS_NOT_AN_EMAIL": {
        httpCode: 400,
        code: "#1012"
    },
    "FACEBOOK_ERROR": {
        httpCode: 403,
        code: '#1013'
    }
}

exports.DEFAULT_ERROR = {
    httpCode: 500,
    code: "#-2",
    description: "Ha ocurrido un error inesperado, intente mas tarde."
}

exports.SERVICES_TYPES = [
    {
        "id": 0,
        "title": "Gold Detail",
        "description": "Exterior Services:\n\n- Complete outside wash\n- Hand dry with clean microfiber towels to protect your paint\n- Clean all door jams and trunk  seals\n- Clean windows inside and out\n- Clean  wheels and tires\n\n Interior Services: \n\n- Basic vacuum seats, carpets, and floor mats\n- Basic Wipe down all interior surfaces"
    },
    {
        "id": 1,
        "title": "Zaphire Detail",
        "description": "Exterior Services:\n\n- Complete outside wash\n- Hand dry with clean microfiber towels to protect your paint\n- Clean all door jams and trunk  seals\n- Clean windows inside and out\n- Clean  wheels and tires\n- Apply high quality spray wax by hand to all painted surfaces\n\n Interior Services: \n\n- Basic vacuum seats, carpets, and floor mats\n- Basic Wipe down all interior surfaces\n- Apply vinyl or leather protectant"
    },
    {
        "id": 2,
        "title": "Emerald Detail",
        "description": "Exterior Services:\n\n- Complete outside wash\n- Hand dry with clean microfiber towels to protect your paint\n- Clean all door jams and trunk  seals\n- Clean windows inside and out\n- Clean  wheels and tires\n- Apply high quality wax by hand to all painted surfaces\n- Multi-step paint polishing/buffing \n\n  Interior Services: \n\n- Vacuum seats, carpets, and floor mats\n- Wipe down all interior surfaces"
    },
    {
        "id": 3,
        "title": "Ruby Detail",
        "description": "Exterior Services:\n\n- Complete outside wash\n- Hand dry with clean microfiber towels to protect your paint\n- Clean all door jams and trunk  seals\n- Clean windows inside and out\n- Clean  wheels and tires\n\n  Interior Services: \n\n- Vacuum seats, carpets, and floor mats\n- Wipe down all interior surfaces\n- Shampoo interior carpets, trunk, and floor mats\n- Deep clean leather seats OR deep clean and shampoo cloth seats\n- Clean headliner"
    },
    {
        "id": 4,
        "title": "Diamond Detail",
        "description": "Exterior Services:\n\n- Complete outside wash\n- Hand dry with clean microfiber towels to protect your paint\n- Clean all door jams and trunk  seals\n- Clean windows inside and out\n- Clean  wheels and tires\n- Apply high quality wax by hand to all painted surfaces\n- Multi-step paint polishing/buffing \n\n Interior Services: \n\n- Vacuum seats, carpets, and floor mats\n- Wipe down all interior surfaces\n- Shampoo interior carpets, trunk, and floor mats\n- Deep clean leather seats OR deep clean and shampoo cloth seats\n- Clean headliner"
    }
]