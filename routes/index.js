/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:41 AM
 *
 * @type {*}
 */
const Router = require('express')
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:41 AM
 *
 * @type {*}
 */
const router = new Router()
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:41 AM
 *
 * @type {*}
 */
const levelRouter = require('./levelRouter');
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:41 AM
 *
 * @type {*}
 */
const userRouter = require('./userRouter');

router.use('/level', levelRouter);
router.use('/user', userRouter);

module.exports = router