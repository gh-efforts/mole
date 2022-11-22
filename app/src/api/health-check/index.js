const Router = require('koa-router');

const router = new Router();

router
  .get('/health-check', async (ctx) => {
    // check some stuff

    ctx.status = 200;
    ctx.body = 'Everything is OK! Have a good day!';
  });

module.exports = router;
