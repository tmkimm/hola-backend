import createError from 'http-errors';
import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import express from 'express';
import * as Sentry from '@sentry/node';
import CustomError from '../CustomError';

export default (app: express.Application) => {
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error: Error) {
        // is Custom Error
        if (error.message !== `jwt malformed` && !(`type` in error)) {
          return true;
        }
        return false;
      },
    }) as express.ErrorRequestHandler,
  );

  // catch 404 and forward to error handler
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(createError(404));
  });

  app.use(function handleMongoError(
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (error instanceof mongoose.Error) return res.status(400).json({ type: 'MongoError', message: error.message });
    next(error);
  });

  app.use(function handlejwtError(
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (error instanceof jsonwebtoken.TokenExpiredError)
      return res.status(401).json({ type: 'TokenExpiredError', message: error.message });
    if (error instanceof jsonwebtoken.JsonWebTokenError)
      return res.status(401).json({ type: 'JsonWebTokenError', message: error.message });
    next(error);
  });

  // custom error handler
  app.use(function handlecustomError(
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (error instanceof CustomError) {
      const { status, type, message } = error;
      return res.status(status).send({ type, message });
    }
    next(error);
  });

  // error handler
  app.use(function (error: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    return res.status(400).json({ message: error.message });
  });
};
