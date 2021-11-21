import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { RewriteFrames } from '@sentry/integrations';
import express from 'express';
import config from '../config/index';

export default (app: express.Application) => {
  Sentry.init({
    dsn: config.SentryDsn,
    tracesSampleRate: 0.2,
    integrations: [
      new RewriteFrames({
        root: global.__rootdir__,
      }),
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
  });
  app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
  app.use(Sentry.Handlers.tracingHandler());
};
