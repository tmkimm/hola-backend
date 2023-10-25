import express from 'express';
import errorHandler from './errorHandler';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import sentry from './sentry';

export default (app: express.Application) => {
  mongooseLoader();
  sentry(app);
  expressLoader(app);
  errorHandler(app);
};
