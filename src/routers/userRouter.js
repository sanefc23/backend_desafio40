const express = require('express');
const userRouter = express.Router();
const userController = require("../controllers/userController");
const passport = require("../middlewares/passportMiddleware")

userRouter.post('/login', passport.authenticate('login', {
    failureRedirect: '/user/failedLogin',
    successRedirect: '/productos',
    failureFlash: true
}), (req, res) => {
    res.redirect('/productos')
});
userRouter.get('/failedLogin', userController.failedLogin);
userRouter.get('/register', userController.registerView);
userRouter.post('/register', passport.authenticate('register', {
    failureRedirect: '/user/failedRegister',
    successRedirect: '/productos',
    failureFlash: true
}));
userRouter.get('/failedRegister', userController.failedRegister);
userRouter.get('/logout', userController.logout);

module.exports = userRouter;