const util = require('util')
const { HttpError } = require('koa')

module.exports = () => {
    return async (ctx, next) => {
        try {
            console.log('==>',{
                url: ctx.url, 
                body: ctx.request.body,
            })
            await next()
        } catch (err) {
            ctx.status = err.status || 500
            ctx.body = err instanceof HttpError? err: { error: util.format(err) }
        }
    }
}
