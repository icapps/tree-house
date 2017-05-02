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
    if (email && password) {
        next();
    }
    /*       getQuery('user', ['id', 'email', 'password', 'is_admin', 'firstname', 'lastname', 'company', 'url'], { email }, true)
               .then((user) => {
                   if (!user) throw new BadRequest(`${email} is not found`, 20);
                   if (!comparePassword(password, user)) throw new Unauthorised('Wrong password and/or email address combination', 30);
                   next(null, { id: user.id, email: user.email, is_admin: user.is_admin, firstname: user.firstname, lastname: user.lastname, company: user.company });
               })
               .catch(error => next(error));*/
}

export function onJwtStrategy(payload, next) {
    if (payload.user.id) {
        next();
    }
    /*        getQuery('user', ['id', 'email', 'is_admin', 'company', 'url', 'firstname', 'lastname'], { id: payload.user.id }, true)
                .then((user) => {
                    if (!user) throw new Unauthorised();
                    next(null, user);
                })
                .catch(error => next(error));*/
}
