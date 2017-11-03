import { BaseService } from '../../../../build';

export default class UserService extends BaseService {
  login() {
    // Mock request
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
    return { user: currentUser };
  }


  /**
   * Create a new user
   * @param {Object} values
   */
  createUser(values) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(values);
      }, 5000);
    });
  }
}
