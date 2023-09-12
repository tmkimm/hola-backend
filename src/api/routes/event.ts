import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { IUser, User as UserModel } from '../../models/User';
import {
  checkPost,
  isPostValid,
  isAccessTokenValid,
  getUserIdByAccessToken,
  isPostIdValid,
  isObjectIdValid,
} from '../middlewares/index';
import { PostService } from '../../services/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Post as PostModel } from '../../models/Post';
import { Notification as NotificationModel } from '../../models/Notification';
import mockData from './mockData';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: events
          description: 공모전에 관련된 API
   */
  app.use('/events', route);

  // #region 공모전 리스트 조회
  /**
   * @swagger
   * paths:
   *   /events:
   *    get:
   *      tags:
   *        - events
   *      summary: 공모전 리스트 조회(리스트 뷰)
   *      parameters:
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  posts:
   *                    type: array
   *                    items:
   *                      $ref: '#/components/schemas/PostMain'
   */
  // #endregion
  route.get(
    '/',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json(mockData.events);
    }),
  );

};
