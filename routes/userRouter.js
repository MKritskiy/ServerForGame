/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:45 AM
 *
 * @type {*}
 */
const Router = require('express')
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:45 AM
 *
 * @type {*}
 */
const router = new Router()
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:45 AM
 *
 * @type {UserController}
 */
const userController = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/reg', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check)
router.get('/download', userController.download)
router.delete('/delete', userController.remove)

module.exports = router