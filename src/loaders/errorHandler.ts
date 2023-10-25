import * as Sentry from '@sentry/node';
import { IncomingWebhook } from '@slack/client';
import express from 'express';
import createError from 'http-errors';
import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import CustomError from '../CustomError';
import config from '../config/index';

export default (app: express.Application) => {
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error: Error) {
        // is Custom Error
        if (
          error.message !== `jwt malformed` &&
          error.message !== `jwt expired` &&
          !(`type` in error) &&
          process.env.NODE_ENV === 'production'
        ) {
          const webhook = new IncomingWebhook(config.SlackWebhook);
          webhook
            .send({
              attachments: [
                {
                  color: 'danger',
                  text: '백엔드 에러 발생',
                  fields: [
                    {
                      title: error.message,
                      value: error.stack! as string,
                      short: false,
                    },
                  ],
                  ts: Math.floor(new Date().getTime() / 1000).toString(),
                },
              ],
            })
            .catch((err: Error) => {
              if (err) Sentry.captureException(err);
            });

          return true;
        }
        return false;
      },
    }) as express.ErrorRequestHandler
  );
  // catch 404 and forward to error handler
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(createError(404));
  });

  app.use(function handleMongoError(
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (error instanceof mongoose.Error) return res.status(400).json({ type: 'MongoError', message: error.message });
    next(error);
  });

  app.use(function handlejwtError(
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (error instanceof jsonwebtoken.TokenExpiredError)
      return res.status(401).json({ type: 'TokenExpiredError', message: error.message });
    if (error instanceof jsonwebtoken.JsonWebTokenError)
      return res.status(401).json({ type: 'JsonWebTokenError', message: error.message });
    next(error);
  });

  // custom error handler
  app.use(function handlecustomError(
    error: CustomError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // == // if (error instanceof CustomError) {
    if ('type' in error) {
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
