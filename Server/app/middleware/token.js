// 校验token
module.exports = () => {
    return async (ctx, next) => {
        if (/(\/api\/users)|((\/api\/admin))/.test(ctx.url)) { // 需要校验token的api
            const res = await ctx.helper.verifyToken(ctx);
            if (res) {
                await next()
            }
        } else {
            await next();
        }
    }
}