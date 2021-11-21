import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: Partial<IUser>;
      Query?: any;
    }
  }
  var __rootdir__: string;
}

declare module 'express' {
  export interface Request<Body = any, Query = any, Params = any, Cookies = any> extends Express.Request {
    body: Body;
    query: Query;
    params: Params;
    cookies: Cookies;
  }
}
