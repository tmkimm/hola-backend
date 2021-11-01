import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../../config/index';
import { User } from '../../models/User';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import CustomError from '../../CustomError';

// 리펙토링 필요(if esle 최소화)
// Access Token이 유효한지 확인한다.
const isAccessTokenValid = asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedUser = await jwt.verify(token, config.jwtSecretKey);
    if (typeof decodedUser === 'string' || 'idToken' in decodedUser === false)
      throw new CustomError('JsonWebTokenError', 401, 'Invaild Token');

    const user = await User.findByIdToken(decodedUser.idToken);
    if (!user) {
      throw new CustomError('JsonWebTokenError', 401, 'User not found');
    } else {
      req.user = {
        _id: user._id,
        nickName: user.nickName,
      };
    }
    next();
  } else {
    throw new CustomError('JsonWebTokenError', 401, 'Token not found');
  }
});
export { isAccessTokenValid };
