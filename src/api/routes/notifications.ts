import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { findNotification, findNotifications, readAll, readNotification } from '../../services/notification';
import { isAccessTokenValid } from '../middlewares/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Notification as NotificationModel } from '../../models/Notification';
import { IUser, User as UserModel } from '../../models/User';

const route = Router();

export default (app: Router) => {
  app.use('/notifications', route);

  // 알림 전체 조회
  route.get(
    '/',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { _id: userId } = req.user as IUser;

      const notifications = await findNotifications(userId);
      return res.status(200).json(notifications);
    }),
  );

  // 알림 상세 조회(개발필요)
  route.get(
    '/:id',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const notice = await findNotification(Types.ObjectId(id));
      return res.status(200).json(notice);
    }),
  );

  // 알림 읽음 처리
  route.patch(
    '/:id/read',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const notice = await readNotification(Types.ObjectId(id));

      return res.status(200).json({
        isRead: true,
      });
    }),
  );

  // 알림 전체 읽음 처리
  route.patch(
    '/read-all',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { _id: userId } = req.user as IUser;
      const notice = await readAll(userId);

      return res.status(200).json({
        isRead: true,
      });
    }),
  );
};
