import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';

/**
 * Get a hashed password
 * @param password
 */
export function getHashedPassword(password) {
    return bcrypt.hashSync(password);
}

/**
 * compare user password hash with unhashed password
 * @param password
 * @param hashedPw
 * @returns {*}
 */
export function comparePassword(password, hashedPw) {
    return bcrypt.compareSync(password, hashedPw);
}

/**
 * Create a new json webtoken
 * @param user
 * @returns {*}
 */
export function createWebtoken(user, jwtSettings) {
    return jwt.sign({ user },
        jwtSettings.secret, {
            algorithm: jwtSettings.algorithm,
            expiresIn: `${jwtSettings.expiresIn}s`, // Expires in seconds
            issuer: jwtSettings.issuer,
            audience: jwtSettings.audience,
        });
}
