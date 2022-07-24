const {
    Router
} = require('express');
const productRouter = require('./productRouter');
const userRouter = require('./userRouter');

const router = Router();

router.use('/productos', productRouter);
router.use('/users', userRouter);

module.exports = router;