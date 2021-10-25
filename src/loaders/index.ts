import express from 'express';
import mongooseLoader from './mongoose';
import expressLoader from './express';
import errorHandler from './errorHandler';

export default (app: express.Application) => {
  mongooseLoader();
  expressLoader(app);
  errorHandler(app);
};
