const { Article } = require('../model')

exports.getTags = async (ctx, next) => {
    const tags = await Article.distinct('tagList')
    return ctx.body = { tags }
    await next()
}