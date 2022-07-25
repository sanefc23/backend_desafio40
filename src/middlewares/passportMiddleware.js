const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usersAPI = require('../APIs/usersAPI');
const bcrypt = require("bcrypt");

passport.use('login', new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password',
        passReqToCallback: true
    },
    async function (req, userName, password, done) {
        const userFound = await usersAPI.getByEmail(userName)
        const validate = (err, user) => {
            console.log('validate: ', user);
            if (err)
                return done(err);
            if (!userFound) {
                message = `User not found with email: ${userName}`;
                req.flash('User not found with email: ', userName);
                return done(null, false, req.flash('User not found!'))
            }
            if (!bcrypt.compareSync(password, user.password)) {
                message = 'Invalid Password';
                console.log('user ASDASDASA: ', user);
                console.log('Invalid Password');
                return done(null, false, req.flash('Invalid Password'))
            }
            return done(null, userFound);
        }
        return validate(userFound);
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