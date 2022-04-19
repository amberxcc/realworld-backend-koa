const { User } = require('../model')


exports.getProfile = async ctx => {
    const target = ctx.targetUser
    let following = false
    if (ctx.user) {
        following = target.assertFollower(ctx.user.id)
    }

    const profile = {
        username: target.username,
        bio: target.bio,
        image: target.image,
        following
    }

    return ctx.body = { profile }
}


exports.follow = async ctx => {

    const target = ctx.targetUser
    target.addFollower(ctx.user.id)

    const profile = {
        username: target.username,
        bio: target.bio,
        image: target.image,
        following: target.assertFollower(ctx.user.id)
    }

    return ctx.body = { profile }
}


exports.unfollow = async ctx => {

    const target = ctx.targetUser
    target.removeFollower(ctx.user.id)

    const profile = {
        username: target.username,
        bio: target.bio,
        image: target.image,
        following: target.assertFollower(ctx.user.id)
    }

    return ctx.body = { profile }
}