const Router = require('express')
const router = new Router()
const levelRouter = require('./levelRouter');
const userRouter = require('./userRouter');

router.use('/level', levelRouter);
router.use('/user', userRouter);

module.exports = router