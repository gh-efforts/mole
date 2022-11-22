const Router = require('koa-router');
const sequelize = require('../../lib/db');
const AleoService = require('./aleo.service');

const router = new Router({
  prefix: '/api/aleo/testnet3',
});

console.log('Call me!');
const service = new AleoService(sequelize);
console.log('Database initialized...');

router
  .get('/commitments/:commitment', async (ctx) => {
    const { commitment } = ctx.params;
    try {
      const target = await service.getProveTarget(commitment);
      ctx.status = 200;
      ctx.body = { data: { target } };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  })

  .get('/reward/:height', async (ctx) => {
    const { height } = ctx.params;
    const intHeight = parseInt(height, 10);
    if (Number.isNaN(intHeight)) {
      ctx.status = 500;
      ctx.body = { error: 'you should pass an integer number' };
    } else {
      try {
        const reward = await service.getCoinbaseReward(intHeight);
        ctx.body = { data: { reward } };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
      }
    }
  });

module.exports = router;
