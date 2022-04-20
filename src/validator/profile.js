const { assert } = require('koa/lib/context')
const validator = require('validator')
const { User } = require('../model')


exports.getProfile = async (ctx, next) => {
    const user = await User.findOne({ username: ctx.params.username })
    ctx.assert(user, 422, '用户不存在')
    ctx.targetUser = user
    await next()
}


exports.follow = async (ctx, next) => {
    const user = await User.findOne({ username: ctx.params.username })
    ctx.assert(user, 422, '用户不存在')
    ctx.targetUser = user
    await next()
}



exports.unfollow = async (ctx, next) => {
    const user = await User.findOne({ username: ctx.params.username })
    ctx.assert(user, 422, '用户不存在')
    ctx.targetUser = user
    await next()
}

