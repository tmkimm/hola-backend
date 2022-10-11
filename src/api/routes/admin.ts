import { Router, Request, Response, NextFunction } from 'express';
import { FeedbackService, AuthService, UserService } from '../../services/index';
import { Feedback as FeedbackModel } from '../../models/Feedback';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { IUser, User as UserModel } from '../../models/User';
import { isPasswordValidWithAdmin } from '../middlewares/isPasswordValidWithAdmin';

const route = Router();

export default (app: Router) => {
  /*
    글에 관련된 Router를 정의한다.
    등록 / 수정 / 삭제하려는 사용자의 정보는 Access Token을 이용하여 처리한다.
    */
  app.use('/admin', route);

  // Admin 로그인
  route.post(
    '/login',
    isPasswordValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { idToken } = req.user as IUser;
      const AuthServiceInstance = new AuthService(UserModel);
      const { _id, nickName, image, likeLanguages, accessToken, refreshToken } = await AuthServiceInstance.SignIn(
        idToken,
      );
      res.cookie('R_AUTH', refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
      });
      return res.status(200).json({
        loginSuccess: true,
        _id,
        nickName,
        image,
        likeLanguages,
        accessToken,
      });
    }),
  );

  // 어드민 등록
  route.post('/', async function (req: Request, res: Response, next: NextFunction) {
    const { rating, content } = req.body;

    const FeedbackServiceInstance = new FeedbackService(FeedbackModel);
    const feedback = await FeedbackServiceInstance.registerFeedback(rating, content);
    return res.status(201).json(feedback);
  });
};
