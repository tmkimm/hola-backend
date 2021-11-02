import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../../config/index';
import { User } from '../../models/User';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import CustomError from '../../CustomError';

// 리펙토링 필요(if esle 최소화)
// Access Token을 이용해 로그인 된 사용자인지 판단한다.
// 로그인된 사용자일 경우 req.user._id를 세팅한다.
const getUserIdByAccessToken = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  let userId;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedUser = await jwt.verify(token, config.jwtSecretKey);

      if (typeof decodedUser === 'string' || 'idToken' in decodedUser === false)
        throw new CustomError('JsonWebTokenError', 401, 'Invaild Token');

      const user = await User.findByIdToken(decodedUser.idToken);
      if (user) {
        userId = user._id;
      }
    } catch (err) {}
  }
  req.user = { _id: userId };
  next();
});
export { getUserIdByAccessToken };
