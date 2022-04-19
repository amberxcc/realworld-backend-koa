const Router = require('koa-router')
const {tagController} = require('../controller')

const router = new Router()

router.get('/', tagController.getTags)

module.exports = router
