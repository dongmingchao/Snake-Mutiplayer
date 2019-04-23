import Router from 'koa-joi-router'
joi = Router.Joi

app = new Router()

app.post '/user/register',
    meta:
        swagger:
            summary: '用户注册'
            description: '注册'
            tags: ['用户管理']
    validate:
        type: 'json'
        body:
            username: joi.string().alphanum().min(3).max(30).required()
            password: joi.string().alphanum().min(6).max(30).required()
        output:
            200:
                body:
                    id:''
    handler: (ctx) ->
        ctx.body = 'step test'

app.post '/user/login',
    meta:
        swagger:
            summary: '用户登陆'
            description: '用户验证登陆'
            tags: ['用户管理']
    validate:
        type: 'json'
        body:
            username: joi.string().alphanum().min(3).max(30).required()
            password: joi.string().alphanum().min(6).max(30).required()
        output:
            200:
                body:
                    id: 'ba ba ba'
    handler: (ctx) ->
        ctx.body = 'user id'

export default app