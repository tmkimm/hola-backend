import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressBasicAuth from 'express-basic-auth';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import routes from '../api/index';
import config from '../config/index';
import schedule from '../schedule/index';
import swaggerOption from '../swagger/swagger';

export default (app: express.Application) => {
  type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];

  const whitelist: StaticOrigin = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://holaworld.io',
    'https://holaworld.io',
    'http://www.holaworld.io',
    'https://www.holaworld.io',
    'ngork.io',
  ];
  // type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];
  const corsOptions = {
    origin(origin: string | undefined, callback: (err: Error | null, singleOrigin?: StaticOrigin) => void) {
      const isWhitelisted = origin && whitelist.indexOf(origin) !== -1;
      callback(null, isWhitelisted);
    },
    credentials: true,
  };

  // Cors Whitelist 관리
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(path.resolve(), 'public')));

  // API Route 설정
  app.use(config.api.prefix, routes());

  app.use(
    ['/api-docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [config.AdminId]: config.AdminPassword,
      },
    })
  );
  // Swagger
  const specs = swaggerJSDoc(swaggerOption);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // 스케줄러 실행
  schedule();
};
