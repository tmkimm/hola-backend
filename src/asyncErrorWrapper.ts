import { NextFunction, Request, Response } from 'express';

function asyncErrorWrapper(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

export { asyncErrorWrapper };
