import passport from 'passport';
import LocalStrategy from 'passport-local';
import dao from './dao.mjs';

passport.use(new LocalStrategy(async (username, password, callback) => {
    const user = await dao.loginUser(username, password);
    if (!user) {
        return callback(null, false, 'Incorrect username or password');
    }

    return callback(null, user);
}));

passport.serializeUser(function (user, callback) {
    return callback(null, user);
});

passport.deserializeUser(function (user, callback) {
    return callback(null, user);
});


export default passport;
