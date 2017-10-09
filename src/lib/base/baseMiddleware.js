export default class BaseMiddleware {
    /**
     * Basic policy function to execute always resolves if not overwritten
     * @param {Request} req express request
     * @param {Response} res express response
     * @returns {Promise}
     */
    execute(req, res) {
        return Promise.resolve({ req, res });
    }
}
