import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Notification as NotificationModel } from '../../models/Notification';
import { IPostDocument, Post as PostModel } from '../../models/Post';
import { IUser, User as UserModel } from '../../models/User';
import { EventService, UserService } from '../../services/index';
import { PostService } from '../../services/post';
import { isString } from '../../utills/isStringEmpty';
import { isAccessTokenValid, isUserIdValid, nickNameDuplicationCheck } from '../middlewares/index';
import { Advertisement as AdvertisementModel } from '../../models/Advertisement';
import { Event as EventModel, IEventDocument } from '../../models/Event';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: users
          description: 사용자에 관련된 API
   */
  app.use('/users', route);

  // s3 pre-sign url 발급
  route.post(
    '/sign',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { fileName } = req.body;
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const signedUrlPut = await UserServiceInstance.getPreSignUrl(fileName);

      return res.status(200).json({
        preSignUrl: signedUrlPut,
      });
    })
  );

  /**
   * @swagger
   * paths:
   *   /users:
   *    get:
   *      tags:
   *        - 사용자
   *      summary: 사용자 조회
   *      description: 닉네임으로 사용자 정보를 조회한다.
   *      parameters:
   *        - name: nickName
   *          in: query
   *          description: 닉네임
   *          required: true
   *          schema:
   *            type: string
   *          example: 'hola!'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/User'
   *        404:
   *          description: parameter is incorrect
   */
  route.get(
    '/',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { nickName } = req.query;
      if (!isString(nickName)) {
        return res.status(400).json({
          message: `parameter is incorrect`,
        });
      }

      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findByNickName(nickName);
      return res.status(200).json(user);
    })
  );

  /**
   * @swagger
   * paths:
   *   /users/{id}:
   *    get:
   *      tags:
   *        - 사용자
   *      summary: 사용자 상세 정보 조회
   *      description: '사용자의 상세 정보를 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 사용자 Id
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
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/User'
   *        404:
   *          description: User not found
   */
  route.get(
    '/:id',
    isUserIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findById(Types.ObjectId(id));

      return res.status(200).json(user);
    })
  );

  //
  /**
   * @swagger
   * paths:
   *   /users/{id}:
   *    patch:
   *      tags:
   *        - 사용자
   *      summary: 사용자 정보 수정
   *      description: 사용자 정보를 수정한다.
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: true
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 사용자 Id
   *          required: true
   *          example: '635a91e837ad67001412321a'
   *          schema:
   *            type: string
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/User'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  _id:
   *                    type: string
   *                    description: 사용자 ID
   *                    example: '61063af4ed4b420bbcfa0b4c'
   *                  nickName:
   *                    type: string
   *                    description: 닉네임
   *                    example: 'hola!'
   *                  image:
   *                    type: string
   *                    description: 사용자 이미지 명
   *                    example: 'default.PNG'
   *                  accessToken:
   *                    type: string
   *                    description: access token
   *                  isExists:
   *                    type: boolean
   *                    description: 닉네임 중복 여부
   *                    example: false
   *        400:
   *          description: Nickname is duplicated.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  isExists:
   *                    type: boolean
   *                    description : 닉네임 중복 여부
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: 'Nickname is duplicated.'
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   *        404:
   *          description: User not found
   */
  route.patch(
    '/:id',
    isUserIdValid,
    isAccessTokenValid,
    nickNameDuplicationCheck,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { _id: tokenUserId } = req.user as IUser;

      const userDTO = req.body;
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const { userRecord, accessToken, refreshToken } = await UserServiceInstance.modifyUser(
        Types.ObjectId(id),
        tokenUserId,
        userDTO
      );

      res.cookie('R_AUTH', refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
      });

      return res.status(200).json({
        _id: userRecord._id,
        nickName: userRecord.nickName,
        image: userRecord.image,
        accessToken,
        isExists: false,
      });
    })
  );

  /**
   * @swagger
   * paths:
   *   /users/{id}/exists:
   *    get:
   *      tags:
   *        - 사용자
   *      summary: 사용자 닉네임 중복 체크
   *      description: 사용자 닉네임 중복 체크
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 사용자 Id
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
   *                  isExists:
   *                    type: boolean
   *                    description : '닉네임 중복 여부(true: 중복)'
   *                    example: isExists
   *        400:
   *          description: Nickname is duplicated.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  isExists:
   *                    type: boolean
   *                    description : '닉네임 중복 여부(true: 중복)'
   *                    example: true
   */
  route.get(
    '/:id/exists',
    nickNameDuplicationCheck,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({
        isExists: false,
      });
    })
  );

  /**
   * @swagger
   * paths:
   *   /users/{id}:
   *    delete:
   *      tags:
   *        - 사용자
   *      summary: 회원 탈퇴
   *      description: 사용자 정보 삭제
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: true
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 사용자 Id
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
   *          description: User not found
   */
  route.delete(
    '/:id',
    isUserIdValid,
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { _id: tokenUserId } = req.user as IUser;

      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      await UserServiceInstance.deleteUser(Types.ObjectId(id), tokenUserId);
      res.clearCookie('R_AUTH');
      return res.status(204).json();
    })
  );

  /**
   * @swagger
   * paths:
   *   /users/likes/{id}:
   *    get:
   *      tags:
   *        - 사용자
   *      summary: 사용자 관심 등록 리스트 조회
   *      description: '관심 등록한 글들을 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 사용자 Id
   *          required: true
   *          example: '61fa3f1fea134800135696b4'
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
   *                  posts:
   *                    type: array
   *                    items:
   *                      $ref: '#/components/schemas/PostMain'
   *        404:
   *          description: User not found
   */
  route.get('/likes/:id', isUserIdValid, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
    const user = await UserServiceInstance.findUserLikes(Types.ObjectId(id));

    if (!user) {
      return res.status(200).json({ posts: null });
    }

    const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
    const result = PostServiceInstance.addPostVirtualField(user as unknown as IPostDocument[], id);
    return res.status(200).json({ posts: result });
  });

  /**
   * @swagger
   * paths:
   *   /users/read-list/{id}:
   *    get:
   *      tags:
   *        - 사용자
   *      summary: 사용자 읽은 목록  조회
   *      description: '읽은 글들을 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 사용자 Id
   *          required: true
   *          example: '61fa3f1fea134800135696b4'
   *          schema:
   *            type: string
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Post'
   *        404:
   *          description: User not found
   */
  route.get(
    '/read-list/:id',
    isUserIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findReadList(Types.ObjectId(id));
      return res.status(200).json(user);
    })
  );

  /**
   * @swagger
   * paths:
   *   /users/myPosts/{id}:
   *    get:
   *      tags:
   *        - 사용자
   *      summary: 사용자 작성 글 목록 조회
   *      description: '내가 작성한 글들을 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 사용자 Id
   *          required: true
   *          example: '610e8f2b6eb2018aceda978e'
   *          schema:
   *            type: string
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Post'
   *        404:
   *          description: User not found
   */
  route.get(
    '/myPosts/:id',
    isUserIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findMyPosts(Types.ObjectId(id));
      return res.status(200).json(user);
    })
  );

  /**
   * @swagger
   * paths:
   *   /users/{id}/like-events:
   *    get:
   *      tags:
   *        - 사용자
   *      summary: 관심 등록 공모전 리스트 조회
   *      description: '관심 등록 공모전 리스트를 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 사용자 Id
   *          required: true
   *          example: '61fa3f1fea134800135696b4'
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
   *                  events:
   *                    type: array
   *                    items:
   *                      $ref: '#/components/schemas/Event'
   *        404:
   *          description: User not found
   */
  route.get('/:id/like-events', isUserIdValid, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
    const user = await UserServiceInstance.findUserLikeEvents(Types.ObjectId(id));

    if (!user) {
      return res.status(200).json(null);
    }

    const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
    const result = EventServiceInstance.addPostVirtualField(user as unknown as IEventDocument[], id);
    return res.status(200).json(result);
  });

  /**
   * @swagger
   * paths:
   *   /users/{id}/like-events/calendar/{year}/{month}:
   *    get:
   *      tags:
   *        - 사용자
   *      summary: 관심 등록 공모전 리스트 조회
   *      description: '관심 등록 공모전 리스트를 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 사용자 Id
   *          required: true
   *          example: '61fa3f1fea134800135696b4'
   *          schema:
   *            type: string
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
   *                      $ref: '#/components/schemas/Event'
   *        404:
   *          description: User not found
   */
  route.get(
    '/:id/like-events/calendar/:year/:month',
    isUserIdValid,
    async (req: Request, res: Response, next: NextFunction) => {
      const { id, year, month } = req.params;
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findUserLikeEventByCalendar(Types.ObjectId(id), year, month);

      if (!user) {
        return res.status(200).json(null);
      }

      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      const result = EventServiceInstance.addPostVirtualField(user as unknown as IEventDocument[], id);
      return res.status(200).json(result);
    }
  );
};
