export default class ErrorHandler {

    /**
     * Pass an Error to an Express response
     * @param {any} res
     * @param {any} error
     * @memberOf ErrorHandler
     */
    execute(res, error) {
        res.status(error.statusCode);
        res.json({ errorMessage: error.message, errorCode: error.code });
    }
}
