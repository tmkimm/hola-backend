import { EventService } from './../../services/event';
import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Event as EventModel } from '../../models/Event';
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
   *     get:
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
   *                  events:
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


  // #region POST - 공모전 등록
  /**
   * @swagger
   * paths:
   *   /events:
   *    post:
   *      tags:
   *        - events
   *      summary: 공모전 등록
   *      description: '신규 공모전를 등록한다.'
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Event'
   *      responses:
   *        201:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Post'
   *        400:
   *          description: Invaild post data
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // #endregion
  route.post(
    '/',
    asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
      try {
        const eventDTO = req.body;
        // TODO 공모전 등록 권한 관리
        //const { _id: userId } = req.user as IUser;

        const EventServiceInstance = new EventService(EventModel);
        const event = await EventServiceInstance.createEvent(eventDTO);
        return res.status(201).json(event);
      } catch (error) {
        return res.status(400).json({
          errors: [
            {
              location: 'body',
              param: 'name',
              error: 'TypeError',
              message: 'must be String',
            },
          ],
          error,
        });
      }
    }),
  );

  // #region 공모전 수정
  /**
   * @swagger
   * paths:
   *   /events/{id}:
   *    patch:
   *      tags:
   *        - events
   *      summary: 공모전 수정
   *      description: 공모전를 수정한다.
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 공모전 Id
   *          required: true
   *          example: '635a91e837ad67001412321a'
   *          schema:
   *            type: string
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Event'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Event'
   *        400:
   *          description: Invaild post data
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // #endregion
  route.patch(
    '/:id',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      //const { _id: tokenUserId, tokenType } = req.user as IUser;
      // TODO event id validation check
      const eventDTO = req.body;
      const EventServiceInstance = new EventService(EventModel);
      const event = await EventServiceInstance.modifyEvent(Types.ObjectId(id), eventDTO);

      return res.status(200).json(event);
    }),
  );

  // #region 글 삭제
  /**
   * @swagger
   * paths:
   *   /events/{id}:
   *    delete:
   *      tags:
   *        - events
   *      summary: 공모전 삭제
   *      description: 공모전를 삭제한다.
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 글 Id
   *          required: true
   *          example: '60213d1c3126991a7cd1d287'
   *          schema:
   *            type: string
   *      responses:
   *        204:
   *          description: successful operation
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   *        404:
   *          description: Post not found
   */
  // #endregion
  route.delete(
    '/:id',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      //const { _id: tokenUserId, tokenType } = req.user as IUser;

      const EventServiceInstance = new EventService(EventModel);
      await EventServiceInstance.deleteEvent(Types.ObjectId(id));
      return res.status(204).json();
    }),
  );

};
