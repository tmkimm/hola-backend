import express from 'express';

export default () => {
  const app = express.Router();
  app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send('hello typescript express!');
  });
  return app;
};
