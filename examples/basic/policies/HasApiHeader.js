import { BasePolicy } from '../../../src/index';

export default class HasApiHeaderPolicy extends BasePolicy {

    setPolicy() {
        return new Promise((resolve) => {
            Object.assign(this.req, { session: { me: { isAuthenticated: true } } });
            resolve();
        });
    }
}
