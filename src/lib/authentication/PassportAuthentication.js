import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import { DEFAULT_LOCAL_STRATEGY_CONFIG as DEF_LOCAL, DEFAULT_JWT_CONFIG as DEF_JWT } from '../constants';
import BaseAuthentication from '../base/BaseAuthentication';
import { createWebtoken } from '../helpers/Cipher';


export default class PassportAuthentication extends BaseAuthentication {
    constructor(localConfig = DEF_LOCAL, jwtConfig = DEF_JWT) {
        super();
        this.setJWTConfiguration(localConfig, jwtConfig);
    }

    /**
     * Expects a function with first parameters inputfields, and second callback function
     * @param {any} fn
     * @memberOf PassportAuthenticaton
     */
    setLocalStrategy(fn) {
        this.onJwtStrategy = fn;
    }

    /**
     * Expects a function with first parameter payload, and second callback function
     * @param {any} fn
     * @memberOf PassportAuthenticaton
     */
    setJwtStrategy(fn) {
        this.onLocalStrategy = fn;
    }

    /**
     * Set both local and JWT configuration via passport
     *
     * @param {any} localConfig
     * @param {any} jwtConfig
     *
     * @memberOf PassportAuthenticaton
     */
    setJWTConfiguration(localConfig, jwtConfig) {
        // Set local configuration object
        this.localStrategyConfig = Object.assign({}, localConfig, {
            passReqToCallback: false,
        });

        if (this.onLocalStrategy) {
            passport.use(new LocalStrategy(this.localStrategyConfig, this.onLocalStrategy));
        }

        // Set JWT configuration object
        this.jwtStrategyConfig = Object.assign({}, jwtConfig, {
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            secretOrKey: jwtConfig.secret,
            authScheme: jwtConfig.authSchem,
            passReqToCallback: false,
        });

        if (this.onJwtStrategy) {
            passport.use(new JwtStrategy(this.jwtStrategyConfig, this.onJwtStrategy));
        }
    }

    /**
     * Create and get a JWT token using the Cipher helper
     * @param {any} user
     * @returns String
     *
     * @memberOf PassportAuthenticaton
     */
    getJwtToken(user) {
        if (this.jwtStrategyConfig) {
            return createWebtoken(user, this.jwtStrategyConfig);
        }
        throw new Error('JWT Strategy configuration not properly set');
    }

    /**
     * Authenticate depending on authentication type (local/jwt)
     *
     * @param {any} req
     * @param {string} [type='local']
     * @returns { Promise }
     *
     * @memberOf PassportAuthenticaton
     */
    authenticate(req, type = 'local') {
        return new Promise((resolve, reject) => {
            passport.authenticate(type, (error, user) => {
                if (error) return reject(error);
                return resolve(user);
            })(req);
        });
    }
}
