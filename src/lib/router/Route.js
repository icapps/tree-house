import ErrorHandler from '../handlers/ErrorHandler';

// TODO: Set via initial configuration on application level
const BASE_PATH = process.env.BASE_PATH || '/api/v1';

// Basic Route
export default class Route {
    /**
     * Route Constructor
     * @param type
     * @param url
     * @param fn
     * @param policies
     */
    constructor(type, url, fn, policies = []) {
        Object.assign(this, { type, url, fn, policies });
        this.errorHandler = new ErrorHandler();
    }

    /**
     * Set function on an express route
     * @param router - ExpressJS router instance
     */
    setRoute(router) {
        if (router) {
            router[this.type.toLowerCase()](`${BASE_PATH}${this.url}`, (req, res) => {
                // Try to execute controller function and handle any thrown errors
                try {
                    this.fn(req, res);
                } catch (error) {
                    this.errorHandler.execute(res, error);
                }
            });
        } else {
            throw new Error('No express router passed to the Route class. Please provide a valid ExpressJS Router instance');
        }
    }

    /**
     * Set policy(ies) on an express route
     * @param router - ExpressJS router instance
     */
    // TODO: Rename to setMiddlewares?
    setPolicies(router) {
        if (router) {
            this.policies.forEach((Policy) => {
                router.use(`${BASE_PATH}${this.url}`, (req, res, next) => {
                    const policy = new Policy(req, res, next);
                    policy.execute();
                });
            });
        } else {
            throw new Error('No express router passed to the Route class. Please provide a valid ExpressJS Router instance');
        }
    }
}
