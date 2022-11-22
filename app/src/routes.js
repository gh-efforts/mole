/* eslint-disable global-require */
module.exports = (app) => {
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // Handle Validation Error
      if (err.name === 'ValidationError') {
        err.status = 422;
      }

      // Handle other errors, e.g. database
      if (err.name === 'BulkWriteError' && err.code === 11000) {
        err.status = 422;
      }
      ctx.status = err.status || 500;
      ctx.body = { message: err.message };
    }
  });

  // Health check does not require authentication
  app.use(require('./api/health-check').routes());
  app.use(require('./api/aleo').routes());
};
