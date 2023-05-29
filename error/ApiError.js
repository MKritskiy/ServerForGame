/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:29 AM
 *
 * @class ApiError
 * @typedef {ApiError}
 * @extends {Error}
 */
class ApiError extends Error {
    /**
     * Creates an instance of ApiError.
     * @date 5/24/2023 - 1:49:29 AM
     *
     * @constructor
     * @param {*} status
     * @param {*} message
     */
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    /**
     * Description placeholder
     * @date 5/24/2023 - 1:49:29 AM
     *
     * @static
     * @param {*} message
     * @returns {ApiError}
     */
    static badRequest(message){
        return new ApiError(404, message)
    }
    /**
     * Description placeholder
     * @date 5/24/2023 - 1:49:29 AM
     *
     * @static
     * @param {*} message
     * @returns {ApiError}
     */
    static internal(message){
        return new ApiError(500, message)
    }
    /**
     * Description placeholder
     * @date 5/24/2023 - 1:49:29 AM
     *
     * @static
     * @param {*} message
     * @returns {ApiError}
     */
    static forbidden(message){
        return new ApiError(403, message)
    }
}

module.exports = ApiError