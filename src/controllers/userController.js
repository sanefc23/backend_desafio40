const UserAPIs = require('../APIs/usersAPI')
const logger = require('../services/logger');

const userController = {
    failedLogin: (req, res) => {
        res.render('index', {
            failedLogin: true,
            message: "Login Failed"
        })
    },
    registerView: (req, res) => {
        res.render('index', {
            registerView: true
        })
    },
    failedRegister: (req, res) => {
        res.render('index', {
            failedLogin: true,
            message: "Register Failed"
        })
    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/');
    }
}

module.exports = userController