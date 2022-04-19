const Router = require('koa-router')
const { profileValidator } = require('../validator')
const auth = require('../middleware/auth')
const { follow, unfollow, getProfile } = require('../controller').profileController

const router = new Router()

router.post('/:username/follow', auth(), profileValidator.follow, follow)
router.delete('/:username/follow', auth(), profileValidator.unfollow, unfollow)
router.get('/:username', auth({ required: false}), profileValidator.getProfile, getProfile)

module.exports = router
