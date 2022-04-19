const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./router')
const errorHandler = require('./middleware/error-handler')

const app = new Koa()

app.use(bodyParser())
app.use(errorHandler())
app.use(router.routes(), router.allowedMethods())



app.listen(3001, () => {
    console.log('start at http://localhost:3001')
})