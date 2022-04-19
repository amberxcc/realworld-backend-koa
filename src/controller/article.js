const { assert } = require('koa/lib/context')
const { Article, User, Comment } = require('../model')
const { slugify } = require('../utils/util')


exports.getOne = async (ctx, next) => {
    const target = ctx.targetArticle
    const author = await User.findOne({ _id: target.author })
    let following = false

    if (ctx.user) {
        following = author.assertFollower(ctx.user.id)
    }

    const article = {
        slug: target.slug,
        title: target.title,
        description: target.description,
        body: target.body,
        tagList: target.tagList,
        createdAt: target.createdAt,
        updatedAt: target.updatedAt,
        favorited: target.assertFavorite(ctx.user.id),
        favoritesCount: target.getFavoriteCount(),
        atuhor: {
            username: author.username,
            bio: author.bio,
            image: author.image,
            following
        },
    }

    return ctx.body = { article }
    await next()
}


exports.creatOne = async (ctx, next) => {
    const newArticle = new Article({
        ...ctx.request.body.article, // 任何Schema中未定义的键/值总是被忽略
        author: ctx.user._id,
        slug: slugify(ctx.request.body.article.title)
    })
    await newArticle.save()

    const author = ctx.user
    const article = {
        slug: newArticle.slug,
        title: newArticle.title,
        description: newArticle.description,
        body: newArticle.body,
        tagList: newArticle.tagList,
        createdAt: newArticle.createdAt,
        updatedAt: newArticle.updatedAt,
        favorited: false,
        favoritesCount: 0,
        atuhor: {
            username: author.username,
            bio: author.bio,
            image: author.image,
            following: author.assertFollower(author.id)
        },
    }

    return ctx.body = { article }
    await next()
}


exports.updateOne = async (ctx, next) => {
    const target = ctx.targetArticle
    const author = await User.findOne({ _id: target.author })
    let following = false

    for (let i in ctx.request.body.article) {
        target[i] = ctx.request.body.article[i]
        if (i === 'title') {
            target.slug = slugify(target[i])
        }
    }
    await target.save()

    if (ctx.user) {
        following = author.assertFollower(ctx.user.id)
    }

    const article = {
        slug: target.slug,
        title: target.title,
        description: target.description,
        body: target.body,
        tagList: target.tagList,
        createdAt: target.createdAt,
        updatedAt: target.updatedAt,
        favorited: target.assertFavorite(ctx.user.id),
        favoritesCount: target.getFavoriteCount(),
        atuhor: {
            username: author.username,
            bio: author.bio,
            image: author.image,
            following
        },
    }

    return ctx.body = { article }
    await next()
}


exports.deleteOne = async (ctx, next) => {
    await Article.deleteOne({ slug: ctx.params.slug })
    ctx.status = 204
    await next()
}


exports.getAll = async (ctx, next) => {
    const { limit = 20, offset = 0, tag, author, favorited } = ctx.query
    const filter = {}
    
    
    // 如果需要筛选tag
    if (tag) filter.tagList = tag

    // 如果需要筛选favorited（被某人收藏的）
    if (favorited) filter.favoritedList = favorited

    // 如果需要筛选author（作者是某人的）
    if (author) {
        const authorUser = await User.findOne({ username: author })

        // 1. author不存在，直接返回
        assert(authorUser, 400, `: ${username}不存在`)
        // 2. author存在，添加到filter
        filter.username = authorUser._id
    }

    const findResults = await Article.find(filter)
        .skip(Number(offset))
        .limit(Number(limit))
        .sort({
            creatAt: -1, // 默认返回的数据按照创建时间排序，-1为逆序，1为顺序
        })

    const articles = []
    for (let article of findResults) {
        const author = await User.findById(article.author)
        let following = false

        if (ctx.user) {
            following = author.assertFollower(ctx.user.id)
        }

        const target = {
            slug: article.slug,
            title: article.title,
            description: article.description,
            body: article.body,
            tagList: article.tagList,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            favorited: ctx.user ? article.assertFavorite(ctx.user.id) : false,
            favoritesCount: article.getFavoriteCount(),
            author: {
                username: author.username,
                bio: author.bio,
                image: author.image,
                following
            },
        }
        articles.push(target)
    }

    const articleCount = await Article.countDocuments()
    return ctx.body = { articles, articleCount }
    await next()
}


exports.getFeed = async (ctx, next) => {

    let articleCount = 0
    const { limit = 20, offset = 0 } = ctx.query
    const findResults = await Article.find({})
        .skip(Number(offset))
        .limit(Number(limit))
        .sort({ creatAt: -1 })

    const articles = []
    for (let target of findResults) {
        const author = await User.findById(target.author)
        if (!author.followers.includes(ctx.user.id)) continue

        let following = false
        if (ctx.user) {
            following = author.assertFollower(ctx.user.id)
        }

        const article = {
            slug: target.slug,
            title: target.title,
            description: target.description,
            body: target.body,
            tagList: target.tagList,
            creatAt: target.createdAt,
            updateAt: target.updateAt,
            favorited: target.assertFavorite(ctx.user.id),
            favoritesCount: target.getFavoriteCount(),
            atuhor: {
                username: author.username,
                bio: author.bio,
                image: author.image,
                following
            },
        }
        articles.push(article)
        articleCount++
    }

    return ctx.body = { articles, articleCount }
    await next()
}


exports.addComment = async (ctx, next) => {
    const newComment = new Comment({
        body: ctx.request.body.comment.body,
        article: ctx.targetArticle.id,
        author: ctx.user.id,
    })
    await newComment.save()

    const author = ctx.user
    const comment = {
        id: newComment.id,
        creatAt: newComment.creatAt,
        updateAt: newComment.updateAt,
        body: newComment.body,
        author: {
            username: author.username,
            bio: author.bio,
            image: author.image,
            following: author.assertFollower(author.id)
        }
    }

    return ctx.body = ({ comment })
    await next()

}


exports.getComments = async (ctx, next) => {
    const comments = []
    const findComments = await Comment.find({ article: ctx.targetArticle.id })

    for (let _comment of findComments) {
        const author = await User.findOne({ id: _comment.author })
        let following = false

        if (ctx.user) {
            following = author.assertFollower(ctx.user.id)
        }

        const comment = {
            id: _comment.id,
            creatAt: _comment.creatAt,
            updateAt: _comment.updateAt,
            body: _comment.body,
            author: {
                username: author.username,
                bio: author.bio,
                image: author.image,
                following
            }
        }
        comments.push(comment)
    }

    return ctx.body = { comments }
    await next()
}


exports.deleteComment = async (ctx, next) => {
    await Comment.deleteOne({ id: ctx.params.id })
    ctx.status = 204
    await next()
}


exports.favorite = async (ctx, next) => {
    const target = ctx.targetArticle
    target.addFavorite(ctx.user.id)
    ctx.status = 200
    await next()
}


exports.unfavorite = async (ctx, next) => {
    const target = request.targetArticle
    target.removeFavorite(ctx.user.id)
    ctx.status = 200
    await next()
}