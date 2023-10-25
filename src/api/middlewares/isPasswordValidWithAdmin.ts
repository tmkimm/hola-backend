import { NextFunction, Request, Response } from 'express';
import CustomError from '../../CustomError';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import config from '../../config/index';

// Admin Login
const isPasswordValidWithAdmin = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { id, password } = req.body;
  const loginType = 'admin';
  if (id === config.AdminId && password === config.AdminPassword) {
    req.user = { idToken: loginType, tokenType: loginType, name: loginType };
    next();
  } else {
    throw new CustomError('authError', 400, 'Id/Password is Invalid');
  }
});

export { isPasswordValidWithAdmin };
