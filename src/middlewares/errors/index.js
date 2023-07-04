const EnumErrors = require("../../handlers/errors/enumError");

const errorHandler = (error, req, res, next) => {
    console.log(error.cause)

    switch (error.code) {
        case EnumErrors.IVALID_TYPES_ERROR:

            res.json({status: 'Error', error: error.name})

            break;

        default:
            res.json({status: 'Error', error: 'Unhadled error'})
            break;
    }
}

module.exports = errorHandler