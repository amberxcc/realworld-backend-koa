const { jwtVerify } = require("../utils/util")
const { User } = require('../model')
const { assert } = require("koa/lib/context")

module.exports = (option = { required: true }) => {
    return async (ctx, next) => {
        const token = ctx.headers.authorization?.substr(6)

        if (token) {  // 有token就验证
            const result = jwtVerify(token)
            const user = await User.findById(result.id)
            if (user)
                ctx.user = user
            else
                return ctx.status = 401
                
        } else if (!token && option.required) {   // 无token且需要验证，抛异常退出
            return ctx.status = 401
        }
        // 其他情况默认啥也不干,传递给下个中间件
        await next()
    }
}
