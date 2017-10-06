import { BaseService } from '../../../../build';

export default class UserService extends BaseService {
    login() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ response: 'User succesfully logged in' });
            }, 3500);
        });
    }


    /**
     * Return the current user data
     * @param {any} currentUser
     * @returns {Object}
     */
    getUser(currentUser) {
        console.log(currentUser);
        return { user: currentUser };
    }
}
