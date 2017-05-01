export const DEFAULT_APPLICATION_CONFIG = {
    port: 3000,
    bodyLimit: '10mb',
    apiKey: 'MN36nyh64z4d5SC70jv-YJV:c0XzN8be}_I24j0qYjs*%zCb01CaHCm6U_S=.E{r89<(gL2d?44{g$?-6OF;IeEIx9',
};

export const DEFAULT_LOCAL_STRATEGY_CONFIG = {
    usernameField: 'email',
    passwordField: 'password',
};

export const DEFAULT_JWT_CONFIG = {
    secret: '5kZxE|gZu1ODB183s772)/3:l_#5hU3Gn5O|2ux3&lhN@LQ6g+"i$zqB_C<6',
    algorithm: 'HS256',
    expiresIn: 24 * 60 * 60,
    issuer: 'combro',
    audience: 'COMBRO',
    authScheme: 'X-Session-Id',
};
