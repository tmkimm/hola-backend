import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from '../config/index';
import routes from '../api/index';

export default (app: express.Application) => {
  type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];

  const whitelist: StaticOrigin = [
    'http://localhost:3000',
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
};
