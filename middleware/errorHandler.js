const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof NotFoundError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong try again later",
    };

    if (err.name === "CastError") {
        customError.msg = `No item found with id : ${err.value}`;
        customError.statusCode = 404;
    }
    if (err.name === "ValidationError") {
        customError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(",");
        customError.statusCode = 400;
    }
    if (err.code && err.code === 11000) {
        customError.msg = `Wprowadzono zduplikowane wartości: ${Object.keys(
        err.keyValue
        )} wprowadź inne wartości`;
        customError.statusCode = 400;
    }


    return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
