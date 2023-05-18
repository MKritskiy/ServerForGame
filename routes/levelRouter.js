const Router = require('express')
const router = new Router()
const levelConrtoller = require('../controllers/levelController');

router.post('/create', levelConrtoller.create)
router.post('/update', levelConrtoller.update)
router.get('/download', levelConrtoller.download)
router.delete('/delete', levelConrtoller.delete)
router.get('/random', levelConrtoller.random)

module.exports = router