import Router from 'koa-joi-router'
joi = Router.Joi

app = new Router()

app.get '/move/up',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        user = ctx.session.user
        ctx.body = status: 'ok'

app.get '/move/down',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        ctx.body = status: 'ok'
        
app.get '/move/left',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        ctx.body = status: 'ok'
        
app.get '/move/right',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        ctx.body = status: 'ok'

export default app