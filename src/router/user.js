const Router = require('koa-router')
const auth = require('../middleware/auth')
const { userController } = require('../controller')
const { userValidator } = require('../validator')

const router = new Router()

router.post('/users/login', userValidator.login, userController.login)
router.post('/users', userValidator.registe, userController.registe)
router.get('/user', auth(), userController.getUser)
router.put('/user', auth(), userController.updateUser)


module.exports = router
