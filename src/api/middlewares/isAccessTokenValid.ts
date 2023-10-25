import { NextFunction, Request, Response } from 'express';
import CustomError from '../../CustomError';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { User } from '../../models/User';
import { isValidAccessToken, verifyJWT } from '../../utills/jwt';

// Access Token이 유효한지 확인한다.
const isAccessTokenValid = asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedUser = await verifyJWT(token);
    if (!isValidAccessToken(decodedUser)) throw new CustomError('JsonWebTokenError', 401, 'Invaild Token');

    const user = await User.findByIdToken(decodedUser.idToken);
    if (!user) {
      throw new CustomError('JsonWebTokenError', 401, 'User not found');
    } else {
      req.user = {
        _id: user._id,
        nickName: user.nickName,
        tokenType: user.tokenType,
      };
    }
    next();
  } else {
    throw new CustomError('JsonWebTokenError', 401, 'Token not found');
  }
});
export { isAccessTokenValid };
