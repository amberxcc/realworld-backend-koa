const { Article } = require('../model')

exports.getTags = async ctx => {
    const tags = await Article.distinct('tagList')
    return ctx.body = { tags }
}