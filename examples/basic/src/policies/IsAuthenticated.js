import { BasePolicy } from 'tree-house';
import { main } from '../index';

export default class IsAuthenticated extends BasePolicy {
    setPolicy() {
        return main.getAuthentication()
            .authenticate(this.req, 'jwt')
            .then(user => Object.assign(this.req, { session: { me: user } }))
            .catch(() => { throw new this.Unauthorised(); });
    }
}
