const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usersAPI = require('../APIs/usersAPI');
const bcrypt = require("bcrypt");
const logger = require('../services/logger')

passport.use('login', new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password',
        passReqToCallback: true
    },
    async function (req, userName, password, done) {
        const user = await usersAPI.getByEmail(userName);
        const validPassword = () => bcrypt.compareSync(password, user.password)
        if (!user || !validPassword) {
            logger.warn('User not found: ' + userName)
            return done(null, false, {
                message: 'Invalid Username/Password'
            })
        }
        logger.warn('User logged: ' + userName)
        return done(null, user)
    }
));

passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async function (req, email, password, done) {
        const user = await usersAPI.getByEmail(email)
        const validate = (err, user) => {
            if (err) {
                req.flash('Register error: ', err);
                return done(err);
            }
            if (user) {
                message = 'User already exists!'
                return done(null, false, req.flash('User already exists'));
            } else if (password === req.body.passwordCheck) {
                let encrytedPassword = bcrypt.hashSync(password, 10);
                let user = {
                    ...req.body,
                    password: encrytedPassword
                }
                usersAPI.register(user)
                return done(null, user);
            } else {
                message = 'Passwords do not match!'
                return done(null, false, req.flash('Passwords do not match!'));
            }
        }
        return validate(user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    let user = usersAPI.getByEmail(email);
    done(null, user);
});

module.exports = passport;