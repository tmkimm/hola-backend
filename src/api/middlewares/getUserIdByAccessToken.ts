import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/User';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import CustomError from '../../CustomError';
import { isValidAccessToken, verifyJWT } from '../../utills/jwt';

const hasTokenByAuthHeaders = (authorization: string | undefined): boolean => {
  return !!(authorization && authorization.startsWith('Bearer'));
};

const getToken = (authorization: string): string => {
  return authorization.split(' ')[1];
};

// 리펙토링 필요(if esle 최소화)
// Access Token을 이용해 로그인 된 사용자인지 판단한다.
// 로그인된 사용자일 경우 req.user._id를 세팅한다.
export const getUserIdByAccessToken = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  let userId;
  const { authorization } = req.headers;

  if (hasTokenByAuthHeaders(authorization)) {
    try {
      const decodedUser = await verifyJWT(getToken(authorization as string));
      if (!isValidAccessToken(decodedUser)) throw new CustomError('JsonWebTokenError', 401, 'Invaild Token');
      const user = await User.findByIdToken(decodedUser.idToken);
      if (user) {
        userId = user._id;
      }
    } catch (err) {}
  }
  req.user = { _id: userId };
  next();
});
