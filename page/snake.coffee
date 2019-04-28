import Router from 'koa-joi-router'
import WebSocket from 'ws'

joi = Router.Joi
websocks = []
app = new Router()

app.get '/move/up',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        websocks[ctx.session.ws_id].send JSON.stringify
            order: 'set direction'
            args: ['up']
        ctx.body = status: 'ok'

app.get '/move/start',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        ws = new WebSocket('ws://localhost:3000/room/arduino');
        ws.on('open',() ->
            st = {
                order: 'set name',
                args: [ctx.query.name]
            }
            ws.send(JSON.stringify(st));
        )
        ctx.session.ws_id = websocks.length;
        websocks.push ws
        ctx.body = '';

app.get '/session/test',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        n = ctx.session.views || 0;
        ctx.session.views = ++n;
        ctx.body = n + ' views';

app.get '/move/down',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        websocks[ctx.session.ws_id].send JSON.stringify
            order: 'set direction'
            args: ['down']
        ctx.body = status: 'ok'
        
app.get '/move/left',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        websocks[ctx.session.ws_id].send JSON.stringify
            order: 'set direction'
            args: ['left']
        ctx.body = status: 'ok'
        
app.get '/move/right',
    meta:
        swagger:
            summary: '移动'
            description: '向上移动'
            tags: ['移动']
    handler: (ctx) ->
        websocks[ctx.session.ws_id].send JSON.stringify
            order: 'set direction'
            args: ['right']
        ctx.body = status: 'ok'

export default app