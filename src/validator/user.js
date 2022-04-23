const { assert } = require('koa/lib/context')
const validator = require('validator')
const { User } = require('../model')
const { myHash } = require('../utils/util')

/* 
1. 此版本没有使用第三方验证中间件，使用ctx.assert方法串行验证
2. 由于数据库操作并不复杂，没有单独封装Service层，所有准备工作都在Validate层处理
*/

exports.registe = async (ctx, next) => {
    const body = ctx.request.body.user
    for (let p of ['username', 'email', 'password']) {
        ctx.assert(body[p], 422, `${p}不能为空`)
        if (p === 'email') {
            ctx.assert(validator.isEmail(body[p]), 422, `email格式不正确`)
        }
    }

    const usernameFindResult = await User.findOne({ username: body.username })
    ctx.assert(!usernameFindResult, 422, `用户名已存在`)

    const emailFindResult = await User.findOne({ email: body.email })
    ctx.assert(!emailFindResult, 422, `邮箱已存在`)

    await next()
}


exports.login = async (ctx, next) => {
    const body = ctx.request.body.user
    for (let p of ['email', 'password']) {
        ctx.assert(body[p] !== undefined, 422, `${p}不能为空`)
        if (p === 'email') {
            ctx.assert(validator.isEmail(body[p]), 422, `email格式不正确`)
        }

    }
    const user = await User.findOne({ email: body.email })
    ctx.assert(user, 422, `用户不存在` )

    ctx.assert(myHash(body.password) === user.password, 422, `密码错误`)
    ctx.user = user

    await next()
}


exports.update = async (ctx, next) => {
    const user = ctx.request.body.user
    let usernameFindResult, emailFindResult
    for(let property in user){
        if(property === 'username'){
            usernameFindResult = await User.findOne({ username: user.username })
            ctx.assert(!usernameFindResult, 422, '用户名已存在')
        }

        if(property === 'email'){
            emailFindResult = await User.findOne({ email: user.email })
            ctx.assert(!emailFindResult, 422, 'email已存在')
        }
    }
    
    await next()
}
