import { Router, Request, Response, NextFunction } from 'express';
import { Notification as NotificationModel } from '../../models/Notification';
import { User as UserModel } from '../../models/User';
import { AuthService, NotificationService } from '../../services/index';
import { isAccessTokenValid } from '../middlewares/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import CustomError from '../../CustomError';

const route = Router();

export default (app: Router) => {
  /*
    권한에 관련된 Router를 정의한다.
    # GET /auth : Refresh Token을 이용해 Access Token 발급
    - Refresh Token이 존재하지 않거나 유효하지 않을 경우 error: -1
    - Access Token이 유효하지 않을 경우 error: -2
    */
  app.use('/auth', route);

  // Refresh Token을 이용해 Access Token 발급
  route.get(
    '/',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      if (!req.cookies.R_AUTH) {
        throw new CustomError('RefreshTokenError', 401, 'Refresh token not found');
      }
      const AuthServiceInstance = new AuthService(UserModel);
      const { decodeSuccess, _id, nickName, email, image, likeLanguages, accessToken } =
        await AuthServiceInstance.reissueAccessToken(req.cookies.R_AUTH);
      // Refresh Token가 유효하지 않을 경우

      if (!decodeSuccess || typeof _id === 'undefined') {
        res.clearCookie('R_AUTH');
        throw new CustomError('RefreshTokenError', 401, 'Invalid refresh token');
      }
      const NotificationServcieInstance = new NotificationService(NotificationModel);
      const unReadNoticeCount = await NotificationServcieInstance.findUnReadCount(_id);
      const hasUnreadNotice = unReadNoticeCount > 0;
      return res.status(200).json({
        _id,
        email,
        nickName,
        image,
        likeLanguages,
        accessToken,
        hasUnreadNotice,
      });
    }),
  );

  // Access Token이 유효한지 체크
  route.get('/isValid', isAccessTokenValid, async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      isValid: true,
    });
  });
};
