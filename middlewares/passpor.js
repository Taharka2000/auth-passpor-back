const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy(
    {
        usernameField: 'usernameOrEmail',
        passwordField: 'password'
    },
    async (usernameOrEmail, password, done) => {
        try {
            const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
            if (!user) {
                return done(null, false, { message: 'Incorrect username or email.' });
            }
            user.authenticate(password, (err, authenticatedUser) => {
                if (err || !authenticatedUser) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, authenticatedUser);
            });
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
