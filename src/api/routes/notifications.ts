import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Notification as NotificationModel } from '../../models/Notification';
import { IUser } from '../../models/User';
import { NotificationService } from '../../services/index';
import { isAccessTokenValid } from '../middlewares/index';

const route = Router();

export default (app: Router) => {
  app.use('/notifications', route);

  /**
   * @swagger
   * paths:
   *   /notifications:
   *    get:
   *      tags:
   *        - 알림
   *      summary: 내 알림 조회
   *      description: '내 알림을 조회한다.'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Notification'
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  route.get(
    '/',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { _id: userId } = req.user as IUser;

      const NoticeServiceInstance = new NotificationService(NotificationModel);
      const notifications = await NoticeServiceInstance.findNotifications(userId);
      return res.status(200).json(notifications);
    })
  );

  /**
   * @swagger
   * paths:
   *   /notifications:
   *    patch:
   *      tags:
   *        - 알림
   *      summary: 알림 읽음 처리
   *      description: '알림을 읽음 처리한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: true
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 알림 Id
   *          required: true
   *          example: '635a91e837ad67001412321a'
   *          schema:
   *            type: string
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  isRead:
   *                    type: boolean
   *                    description : 읽음 여부
   *                    example: true
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // 알림 읽음 처리
  route.patch(
    '/:id/read',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const NotificationServcieInstance = new NotificationService(NotificationModel);
      const notice = await NotificationServcieInstance.readNotification(Types.ObjectId(id));

      return res.status(200).json({
        isRead: true,
      });
    })
  );

  // 알림 전체 읽음 처리
  route.patch(
    '/read-all',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { _id: userId } = req.user as IUser;
      const NotificationServcieInstance = new NotificationService(NotificationModel);
      const notice = await NotificationServcieInstance.readAll(userId);

      return res.status(200).json({
        isRead: true,
      });
    })
  );
};
