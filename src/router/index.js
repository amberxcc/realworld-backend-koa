const Router = require('koa-router')
const article = require('./article')
const user = require('./user')
const profile = require('./profile')
const tag = require('./tag')

const router = new Router()

router.use('/api', user.routes(), user.allowedMethods())
router.use('/api/articles', article.routes(), article.allowedMethods())
router.use('/api/profiles', profile.routes(), profile.allowedMethods())
router.use('/api/tags', tag.routes(), tag.allowedMethods())


module.exports = router
