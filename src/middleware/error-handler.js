const util = require('util')
const { HttpError } = require('koa')
const logger = require('../utils/logger')

module.exports = () => {
    return async (ctx, next) => {
        try {
            logger.debug(`request ==> ${ctx.url}`,{
                method: ctx.method,
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
