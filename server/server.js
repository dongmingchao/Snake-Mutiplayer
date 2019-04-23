/**
 * This is a module Entry
 * 这个是模块入口文件
 */
import static_server from 'koa-static';
import api from './api';
import index from '../page/index';
import step from '../page/users.coffee';

const Koa = require('koa');
const Router = require('koa-router');
 
const app = new Koa();
const router = new Router();

router.use('/',index.routes());
router.use(step.middleware());
router.use(api.middleware());

app.use(static_server('assets'));
app.use(router.routes()).use(router.allowedMethods());
export default app;