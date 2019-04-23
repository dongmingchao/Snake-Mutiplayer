import { SwaggerAPI } from 'koa-joi-router-docs';
import Router from 'koa-joi-router';
import users from '../page/users.coffee';

/**
 * Define routes
 */
const router = Router();

// Get /user/:_id
// router.get('/user/:_id', {
//   meta: {
//     swagger: {
//       summary: 'Get User Info',
//       description: `Note: \nSensitive data can only be viewed by the \`corresponding user\` or \`Admin\`.`,
//       tags: ['users']
//     }
//   },
//   validate: {
//     params: {
//       _id: Joi.string().alphanum().max(24).description('User id').required()
//     },
//     output: {
//       '200-299': {
//         body: Joi.object({
//           userId: Joi.string().description('User id')
//         }).options({
//           allowUnknown: true
//         }).description('User object')
//       }
//     }
//   },
//   handler: async ctx => {
//     console.log('getUser...')
//     ctx.body = {
//       userId: ctx.params._id
//     }
//   }
// });
//
// // POST /signup
// router.post('/signup', {
//   meta: {
//     swagger: {
//       summary: 'User Signup',
//       description: 'Signup with username and password.',
//       tags: ['users']
//     }
//   },
//   validate: {
//     type: 'json',
//     body: {
//       username: Joi.string().alphanum().min(3).max(30).required(),
//       password: Joi.string().alphanum().min(6).max(30).required()
//     },
//     output: {
//       200: {
//         body: {
//           userId: Joi.string().description('Newly created user id')
//         }
//       }
//     }
//   },
//   handler: async ctx => {
//     ctx.body = {
//       userId: ctx.body.username
//     }
//   }
// });

/**
 * Generate Swagger json from the router object
 */
const generator = new SwaggerAPI();

generator.addJoiRouter(users);
generator.addJoiRouter(router);

const spec = generator.generateSpec({
  info: {
    title: 'Example API',
    description: 'API for creating and editing examples.',
    version: '1.1'
  },
  basePath: '/',
  tags: [{
    name: '用户管理',
    description: '对基础用户的注册/登陆'
  }],
}, { 
  defaultResponses: {} // Custom default responses if you don't like default 200
});

/**
 * Swagger JSON API
 */
router.get('/_api.json', async ctx => {
  ctx.body = JSON.stringify(spec, null, '  ')
});

export default router;