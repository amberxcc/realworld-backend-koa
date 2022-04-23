const Router = require('koa-router')
const auth = require('../middleware/auth')
const { articleController } = require('../controller')
const { articleValidator } = require('../validator')

const router = new Router()

router.get('/', auth({required: false}), articleController.getAll)
router.get('/feed', auth(), articleController.getFeed)
router.get('/:slug', auth({required: false}), articleValidator.getArticle, articleController.getOne)
router.post('/', auth(), articleValidator.creatArticle, articleController.creatOne)
router.put('/:slug', auth(), articleValidator.updateArticle, articleController.updateOne)
router.delete('/:slug', auth(), articleValidator.deleteArticle, articleController.deleteOne)
router.post('/:slug/comments', auth(), articleValidator.addComment, articleController.addComment)
router.get('/:slug/comments', auth({required: false}), articleValidator.getComments, articleController.getComments)
router.delete('/:slug/comments/:id', auth(), articleValidator.deleteComment, articleController.deleteComment)
router.post('/:slug/favorite', auth(), articleValidator.favorite, articleController.favorite)
router.delete('/:slug/favorite', auth(), articleValidator.unfavorite, articleController.unfavorite)

module.exports = router