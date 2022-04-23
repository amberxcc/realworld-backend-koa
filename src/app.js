const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./router')
const errorHandler = require('./middleware/error-handler')
const logger = require('./utils/logger')
const { SERVER_PORT } = require('./config')

const app = new Koa()

app.use(bodyParser())
app.use(errorHandler())
app.use(router.routes(), router.allowedMethods())

app.listen(SERVER_PORT, () => {
    logger.info(`Server start at http://localhost:${SERVER_PORT}`)
})