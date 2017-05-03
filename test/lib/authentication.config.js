import { main } from '../start.test';

export const localStrategyConfig = {
    usernameField: 'email',
    passwordField: 'password',
};

export const jwtStrategyConfig = {
    secret: '8^dxE|gZu1ODB183s772)/3:l_#fdsfsdf|2ux3&lhN@LQ6g+"i$zq45fsdq1',
    algorithm: 'HS256',
    expiresIn: 24 * 60 * 60,
    issuer: 'pubcrawl',
    audience: 'PUBCRAWL',
    authScheme: 'X-Session-Id',
};

export function onLocalStrategy(email, password, next) {
    if (email && (password === 'notSoRandom')) {
        // Get JWT token from authentication on the main application
        const token = main.getAuthentication().getJwtToken({ email, password });
        next(null, { token });
    }
}

export function onJwtStrategy(payload, next) {
    if (payload.user) {
        next(null, { isAuthenticated: true });
    }
}
