import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { isString } from '../../utills/isStringEmpty';
import { IUser, User as UserModel } from '../../models/User';
import { UserService, NotificationService } from '../../services/index';
import { nickNameDuplicationCheck, isAccessTokenValid, isUserIdValid } from '../middlewares/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Post as PostModel } from '../../models/Post';
import { Notification as NotificationModel } from '../../models/Notification';

const route = Router();

export default (app: Router) => {
  /*
    dashboard에 관련된 Router를 정의한다.
    */
  app.use('/dashboard', route);

  // 사용자 정보 데일리 엑션(현재 총 회원 수, 오늘 가입자, 오늘 탈퇴자)
  route.get(
    '/users/daily',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findDashboardDailyUser();
      return res.status(200).json(user);
    }),
  );

  // 일자별 회원 가입 현황(일자 / 신규 가입자 / 탈퇴자)
  route.get(
    '/users/history',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findDashboardHistoryUser();
      return res.status(200).json(user);
    }),
  );
};
