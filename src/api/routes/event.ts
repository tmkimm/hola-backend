import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Advertisement as AdvertisementModel } from '../../models/Advertisement';
import { Event as EventModel } from '../../models/Event';
import { EventService } from './../../services/event';
import { checkEvent, isEventValid } from '../middlewares/isEventValid';
import { isAccessTokenValidWithAdmin } from '../middlewares/isAccessTokenValidWithAdmin';
import { isAccessTokenValid } from '../middlewares/isAccessTokenValid';
import { isEventIdValid } from '../middlewares/isEventIdValid';
import { IUser } from '../../models/User';
import { getUserIdByAccessToken } from '../middlewares/getUserIdByAccessToken';
import { checkADIsActive } from '../middlewares/checkADIsActive';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: events
          description: 공모전에 관련된 API
   */
  app.use('/events', route);

  // #region 공모전 리스트 조회(페이징)
  /**
   * @swagger
   * paths:
   *   /events:
   *    get:
   *      tags:
   *        - 공모전
   *      summary: 공모전 리스트 조회(Pagination)
   *      description: 공모전 리스트를 조회한다.
   *      parameters:
   *        - name: page
   *          in: query
   *          description: 현재 페이지(기본 1)
   *          required: true
   *          schema:
   *            type: number
   *          example: 1
   *        - name: sort
   *          in: query
   *          description: '정렬(최신순: -createdAt, 인기순: -views)'
   *          required: false
   *          schema:
   *            type: string
   *          example: '-createdAt'
   *        - name: eventType
   *          in: query
   *          description: '공모전 구분(conference, hackathon, contest, bootcamp, others)'
   *          required: false
   *          schema:
   *            type: string
   *          example: '1'
   *        - name: search
   *          in: query
   *          description: '검색'
   *          required: false
   *          schema:
   *            type: string
   *          example: '토이프로젝트'
   *        - name: onOffLine
   *          in: query
   *          description: '진행방식(on:온라인, off:오프라인, onOff: 온/오프라인)'
   *          required: false
   *          schema:
   *            type: string
   *          example: 'on'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Event'
   */
  // #endregion
  route.get(
    '/',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { page, sort, eventType, search, onOffLine } = req.query;
      const { _id: userId } = req.user as IUser;
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const events = await EventServiceInstance.findEventList(page, sort, eventType, search, onOffLine, userId);
      return res.status(200).json(events);
    })
  );

  // #region 공모전 리스트 조회(페이징)
  /**
   * @swagger
   * paths:
   *   /events/last-page:
   *    get:
   *      tags:
   *        - 공모전
   *      summary: 공모전 리스트 조회 - 마지막 페이지 조회
   *      description: Pagination에서 마지막 페이지를 조회한다.
   *      parameters:
   *        - name: eventType
   *          in: query
   *          description: '공모전 구분(conference, hackathon, contest, bootcamp, others)'
   *          required: false
   *          schema:
   *            type: string
   *          example: '1'
   *        - name: search
   *          in: query
   *          description: '검색'
   *          required: false
   *          schema:
   *            type: string
   *          example: '토이프로젝트'
   *        - name: onOffLine
   *          in: query
   *          description: '진행방식(on:온라인, off:오프라인, onOff: 온/오프라인)'
   *          required: false
   *          schema:
   *            type: string
   *          example: 'on'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  lastPage:
   *                    type: number
   *                    description : '전체 페이지 수'
   *                    example: 7
   */
  // #endregion
  route.get(
    '/last-page',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { eventType, search, onOffLine } = req.query;
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const lastPage = await EventServiceInstance.findEventLastPage(eventType, search, onOffLine);
      return res.status(200).json({ lastPage });
    })
  );

  // #region 공모전 캘린더뷰 조회
  /**
   * @swagger
   * paths:
   *   /events/calendar/{year}/{month}:
   *    get:
   *      tags:
   *        - 공모전
   *      summary: 공모전 캘린더뷰 조회
   *      description: 공모전 캘린더뷰를 조회한다.
   *      parameters:
   *        - name: year
   *          in: path
   *          description: 년도
   *          required: true
   *          schema:
   *            type: number
   *          example: 2023
   *        - name: month
   *          in: path
   *          description: 달
   *          required: true
   *          schema:
   *            type: string
   *          example: 09
   *        - name: eventType
   *          in: query
   *          description: '공모전 구분(conference, hackathon, contest, bootcamp, others)'
   *          required: false
   *          schema:
   *            type: string
   *          example: '1'
   *        - name: search
   *          in: query
   *          description: '검색'
   *          required: false
   *          schema:
   *            type: string
   *          example: '토이프로젝트'
   *        - name: onOffLine
   *          in: query
   *          description: '진행방식(on:온라인, off:오프라인, onOff: 온/오프라인)'
   *          required: false
   *          schema:
   *            type: string
   *          example: 'on'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Event'
   */
  // #endregion
  route.get(
    '/calendar/:year/:month',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { year, month } = req.params;
      const { eventType, search, onOffLine } = req.query;
      const { _id: userId } = req.user as IUser;
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const events = await EventServiceInstance.findEventListInCalendar(
        year,
        month,
        eventType,
        search,
        userId,
        onOffLine
      );
      return res.status(200).json(events);
    })
  );

  // #region 진행중인 모든 공모전 조회(SelectBox 전용)
  /**
   * @swagger
   * paths:
   *   /events/bulk:
   *    get:
   *      tags:
   *        - 공모전
   *      summary: 진행중인 모든 공모전 조회(SelectBox 전용)
   *      description: 진행중인 모든 공모전 조회한다.(80개)
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Event'
   */
  // #endregion
  route.get(
    '/bulk',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const events = await EventServiceInstance.findEventTitleForSelectBox();
      return res.status(200).json(events);
    })
  );

  // #region 추천 공모전
  /**
   * @swagger
   * paths:
   *   /events/recommend:
   *    get:
   *      tags:
   *        - 공모전
   *      summary: 추천 공모전 조회(AD)
   *      description: 추천 공모전을 조회한다.
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/RecommendedEvent'
   */
  // #endregion
  route.get(
    '/recommend',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const events = await EventServiceInstance.findRecommendEventList();
      return res.status(200).json(events);
    })
  );

  // #region 공모전 이미지 S3 Pre-Signed URL 발급
  /**
   * @swagger
   * paths:
   *   /events/pre-sign-url:
   *    get:
   *      tags:
   *        - 공모전
   *      summary: 공모전 이미지 S3 Pre-Signed URL 발급
   *      description: 공모전 이미지 S3 Pre-Signed URL 발급
   *      parameters:
   *        - name: fileName
   *          in: query
   *          description: 파일명
   *          required: true
   *          example: '2839_284_42.jpg'
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
   *                  preSignUrl:
   *                    type: string
   *                    description: Pre-signed url
   */
  // #endregion
  route.get(
    '/pre-sign-url',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { fileName } = req.query;
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const signedUrlPut = await EventServiceInstance.getPreSignUrl(fileName);

      return res.status(200).json({
        preSignUrl: signedUrlPut,
      });
    })
  );

  // #region 공모전 상세 보기
  /**
   * @swagger
   * paths:
   *   /events/{id}:
   *    get:
   *      tags:
   *        - 공모전
   *      summary: 공모전 상세 보기
   *      description: '공모전 상세 정보를 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 공모전 Id
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
   *                $ref: '#/components/schemas/Event'
   *        404:
   *          description: Event not found
   */
  // #endregion
  route.get(
    '/:id',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const eventId = req.params.id;
      const { _id: userId } = req.user as IUser;
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const event = await EventServiceInstance.findEvent(Types.ObjectId(eventId), userId);
      return res.status(200).json(event);
    })
  );

  // #region 공모전 상세에서 관련 공모전 추천
  /**
   * @swagger
   * paths:
   *   /events/{id}/recommend:
   *    get:
   *      tags:
   *        - 공모전
   *      summary: 공모전 상세에서 관련 공모전 추천
   *      description: '현재 읽고 있는 공모전 유형과 같은 글을 추천한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 공모전 Id
   *          required: true
   *          example: '635a91e837ad67001412321a'
   *          schema:
   *            type: string
   *        - name: eventType
   *          in: query
   *          description: 공모전 구분(conference, hackathon, contest, bootcamp, others)
   *          required: true
   *          schema:
   *            type: string
   *          example: 'conference'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Event'
   *        404:
   *          description: Event not found
   */
  // #endregion
  route.get(
    '/:id/recommend',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const eventId = req.params.id;
      const { eventType } = req.query;
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const event = await EventServiceInstance.findRecommendEventListInDetail(Types.ObjectId(eventId), eventType);
      return res.status(200).json(event);
    })
  );

  // #region POST - 공모전 등록
  /**
   * @swagger
   * paths:
   *   /events:
   *    post:
   *      tags:
   *        - 공모전
   *      summary: 공모전 등록
   *      description: '신규 공모전를 등록한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/PostEvent'
   *      responses:
   *        201:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Event'
   *        400:
   *          description: Invaild event data
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // #endregion
  route.post(
    '/',
    isAccessTokenValidWithAdmin,
    checkEvent,
    isEventValid,
    asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
      try {
        const eventDTO = req.body;
        // TODO 공모전 등록 권한 관리
        //const { _id: userId } = req.user as IUser;

        const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
        const event = await EventServiceInstance.createEvent(eventDTO);
        return res.status(201).json(event);
      } catch (error) {
        return res.status(400).json({
          errors: [
            {
              location: 'body',
              param: 'name',
              error: 'TypeError',
              message: 'Invalid request',
            },
          ],
          error,
        });
      }
    })
  );

  // #region 공모전 수정
  /**
   * @swagger
   * paths:
   *   /events/{id}:
   *    put:
   *      tags:
   *        - 공모전
   *      summary: 공모전 수정
   *      description: 공모전를 수정한다.
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
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
   *          description: Invaild event data
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // #endregion
  route.put(
    '/:id',
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      //const { _id: tokenUserId, tokenType } = req.user as IUser;
      // TODO event id validation check
      const eventDTO = req.body;
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const event = await EventServiceInstance.modifyEvent(Types.ObjectId(id), eventDTO);

      return res.status(200).json(event);
    })
  );

  // #region 공모전 삭제
  /**
   * @swagger
   * paths:
   *   /events/{id}:
   *    delete:
   *      tags:
   *        - 공모전
   *      summary: 공모전 삭제
   *      description: 공모전를 삭제한다.
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 공모전 Id
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
   *          description: Event not found
   */
  // #endregion
  route.delete(
    '/:id',
    isAccessTokenValidWithAdmin,
    checkADIsActive,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      //const { _id: tokenUserId, tokenType } = req.user as IUser;

      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      await EventServiceInstance.deleteEvent(Types.ObjectId(id));
      return res.status(204).json();
    })
  );

  /**
   * @swagger
   * tags:
        - name: likes
          description: 공모전 관심 등록
   */
  // #region 좋아요 등록
  /**
   * @swagger
   * paths:
   *   /events/likes:
   *    post:
   *      tags:
   *        - 공모전 관심등록
   *      summary: 좋아요 등록
   *      description: 좋아요 등록
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: true
   *          schema:
   *            type: string
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                eventId:
   *                  type: string
   *                  description : '글 ID'
   *                  example: '61063af4ed4b420bbcfa0b4c'
   *      responses:
   *        201:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  likeUsers:
   *                    type: array
   *                    description: 사용자 리스트
   *                    items:
   *                      type: string
   *        400:
   *          description: Invaild post data
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // #endregion
  route.post(
    '/likes',
    isAccessTokenValid,
    isEventIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { eventId } = req.body;
      const { _id: userId } = req.user as IUser;
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const event = await EventServiceInstance.addLike(Types.ObjectId(eventId), userId);

      return res.status(201).json({ likeUsers: event.likes });
    })
  );

  /**
   * @swagger
   * paths:
   *   /events/likes/{id}:
   *    delete:
   *      tags:
   *        - 공모전 관심등록
   *      summary: 공모전 좋아요 삭제
   *      description: 좋아요 삭제
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: true
   *          schema:
   *            type: string
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
   *          description: Event not found
   */
  route.delete(
    '/likes/:id',
    isAccessTokenValid,
    isEventIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const eventId = req.params.id; // 사용자 id
      const { _id: userId } = req.user as IUser;

      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const event = await EventServiceInstance.deleteLike(Types.ObjectId(eventId), userId);
      return res.status(201).json({ likeUsers: event.likes });
    })
  );
};
