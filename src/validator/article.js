const { assert } = require('koa/lib/context')
const validator = require('validator')
const { Article, Comment } = require('../model')
const { isValidObjectId } = require('mongoose')


exports.creatArticle = async (ctx, next) => {
    for(let property of ['title','description', 'body']){
        assert(ctx.request.body.article[property], 400, `${property} 不能为空`)
    }
    await next()
}


exports.getArticle = async (ctx, next) => {
    const target = await Article.findOne({ slug: ctx.params.slug })
    assert(target, 400, `slug:${ctx.params.slug} 不存在`)
    
    ctx.targetArticle = target
    await next()
}


exports.updateArticle = async (ctx, next) => {
    const target = await Article.findOne({ slug: ctx.params.slug })
    assert(target, 400, `slug:${ctx.params.slug} 不存在`)
    
    ctx.targetArticle = target
    await next()
}


exports.deleteArticle = async (ctx, next) => {
    const target = await Article.findOne({ slug: ctx.params.slug })
    assert(target, 400, `slug:${ctx.params.slug} 不存在`)
    assert(target.author.toString()===ctx.user.id, 403, `无权限删除`)

    ctx.targetArticle = target
    await next()
}


exports.addComment = async (ctx, next) => {
    assert(ctx.request.body.comment.body, 400, '评论内容不能为空')
    const target = await Article.findOne({ slug: ctx.params.slug })
    assert(target, 400, `slug:${ctx.params.slug} 不存在`)

    ctx.targetArticle = target
    await next()
}


exports.getComments = async (ctx, next) => {
    const target = await Article.findOne({ slug: ctx.params.slug })
    assert(target, 400, `slug:${ctx.params.slug} 不存在`)
    
    ctx.targetArticle = target
    await next()
}

exports.deleteComment = async (ctx, next) => {
    const slug = ctx.params.slug
    const id = ctx.params.id
    const targetArticle = await Article.findOne({ slug })
    const targetComment = await Comment.findOne({ id })

    assert(target, 400, `slug:${ctx.params.slug} 不存在`)
    assert(isValidObjectId(id), 400, `id${id}格式错误`)
    assert(ctx.user.id === targetComment.author, 403, `无权限删除`)
    
    ctx.targetArticle = targetArticle
    ctx.targetComment = targetComment
    await next()
}


exports.favorite = async (ctx, next) => {
    const target = await Article.findOne({ slug: ctx.params.slug })
    assert(target, 400, `slug:${ctx.params.slug} 不存在`)
    
    ctx.targetArticle = target
    await next()
}


exports.unfavorite = async (ctx, next) => {
    const target = await Article.findOne({ slug: ctx.params.slug })
    assert(target, 400, `slug:${ctx.params.slug} 不存在`)
    
    ctx.targetArticle = target
    await next()
}