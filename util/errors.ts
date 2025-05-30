export { };
class ApiError extends Error {
    statusCode: number;
    details?: any;

    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;