const { User } = require('../model')
const { jwtSign } = require("../utils/util")


exports.login = async (ctx, next) => {
    const user = {
        username: ctx.user.username,
        email: ctx.user.email,
        bio: ctx.user.bio,
        image: ctx.user.image,
        token: jwtSign({ id: ctx.user._id })
    }
    return ctx.body = { user }

    await next()
}


exports.registe = async (ctx, next) => {
    const newUser = new User(ctx.request.body.user)
    await newUser.save()

    const user = {
        username: newUser.username,
        email: newUser.email,
        token: jwtSign({ id: newUser._id }),
        bio: null,
        image: null,
    }
    return ctx.body = { user }
    
    await next()
}


exports.getUser = async (ctx, next) => {

    const user = {
        username: ctx.user.username,
        email: ctx.user.email,
        bio: ctx.user.bio,
        image: ctx.user.image,
        token: jwtSign({ id: ctx.user._id })
    }
    return ctx.body = { user }

    await next()
}

exports.updateUser = async (ctx, next) => {
    for(let property in ctx.request.body.user){
        ctx.user[property] = ctx.request.body.user[property]
    }
    await ctx.user.save()

    const user = {
        username: ctx.user.username,
        email: ctx.user.email,
        bio: ctx.user.bio,
        image: ctx.user.image,
        token: jwtSign({ id: ctx.user._id })
    }
    return ctx.body = { user }

    await next()
}