import koa from 'koa-router';

let app = new koa();
app.get('/',ctx => {
    ctx.body = 'Begin From Here';
}).get('/help',ctx => {
    ctx.body = 'help';
}).get('/self',ctx => {
    ctx.body = 'abc123123';
});

export default app;