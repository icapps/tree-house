export default class ResponseHandler {
    /**
     * Send JSON as a response to an Express response
     * @param {any} res
     * @param {any} data
     * @memberOf ResponseHandler
     */
    execute(res, data) {
        res.status(200);
        res.json(data);
    }
}
