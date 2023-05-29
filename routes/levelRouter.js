/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:43 AM
 *
 * @type {*}
 */
const Router = require('express')
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:43 AM
 *
 * @type {*}
 */
const router = new Router()
/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:43 AM
 *
 * @type {LevelController}
 */
const levelConrtoller = require('../controllers/levelController');

router.post('/create', levelConrtoller.create)
router.post('/update', levelConrtoller.update)
router.get('/download', levelConrtoller.download)
router.delete('/delete', levelConrtoller.delete)
router.get('/random', levelConrtoller.random)

module.exports = router