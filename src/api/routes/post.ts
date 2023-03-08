import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { IUser, User as UserModel } from '../../models/User';
import {
  checkPost,
  isPostValid,
  isAccessTokenValid,
  getUserIdByAccessToken,
  isPostIdValid,
} from '../middlewares/index';
import { PostService } from '../../services/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Post as PostModel } from '../../models/Post';
import { Notification as NotificationModel } from '../../models/Notification';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: posts
          description: 글에 관련된 API
   */
  app.use('/posts', route);

  // #region 글 리스트 조회(메인)
  /**
   * @swagger
   * paths:
   *   /posts:
   *    get:
   *      tags:
   *        - posts
   *      summary: 글 리스트 조회(메인)
   *      description: 메인 페이지에서 글 리스트를 조회한다.
   *      parameters:
   *        - name: language
   *          in: query
   *          description: 사용 언어
   *          required: false
   *          schema:
   *            type: string
   *          example: 'react,java'
   *        - name: offset
   *          in: query
   *          description: 건너뛸 개수
   *          required: true
   *          schema:
   *            type: string
   *          example: 00
   *        - name: limit
   *          in: query
   *          description: 조회할 개수
   *          required: true
   *          schema:
   *            type: string
   *          example: 20
   *        - name: sort
   *          in: query
   *          description: '정렬. 필드는 ,로 구분하며 +는 오름차순, -는 내림차순 '
   *          required: false
   *          schema:
   *            type: string
   *          example: '-createdAt,+views'
   *        - name: position
   *          in: query
   *          description: '직군(ALL: 전체, FE: 프론트엔드, BE: 백엔드, DE: 디자이너, IOS: IOS, AND: 안드로이드, DEVOPS: DevOps, PM)'
   *          required: false
   *          schema:
   *            type: string
   *          example: 'FE,IOS'
   *        - name: type
   *          in: query
   *          description: '모집 구분(1 : 프로젝트, 2: 스터디)'
   *          required: false
   *          schema:
   *            type: string
   *          example: '1'
   *        - name: period
   *          in: query
   *          description: '조회 기간(일). 14일 경우 14일 이내의 글만 조회'
   *          required: false
   *          schema:
   *            type: string
   *          example: 14
   *        - name: isClosed
   *          in: query
   *          description: '마감여부(true, false)'
   *          required: false
   *          schema:
   *            type: string
   *          example: true
   *        - name: search
   *          in: query
   *          description: '검색'
   *          required: false
   *          schema:
   *            type: string
   *          example: '토이프로젝트'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Post'
   */
  // #endregion
  route.get(
    '/',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { offset, limit, sort, language, period, isClosed, type, position, search } = req.query;
      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const posts = await PostServiceInstance.findPost(
        offset,
        limit,
        sort,
        language,
        period,
        isClosed,
        type,
        position,
        search,
      );

      return res.status(200).json(posts);
    }),
  );

  // #region 글 리스트 조회(페이징)
  /**
   * @swagger
   * paths:
   *   /posts/pagination:
   *    get:
   *      tags:
   *        - posts
   *      summary: 글 리스트 조회(페이징)
   *      description: 메인 페이지에서 글 리스트를 조회한다.
   *      parameters:
   *        - name: language
   *          in: query
   *          description: 사용 언어
   *          required: false
   *          schema:
   *            type: string
   *          example: 'react,java'
   *        - name: page
   *          in: query
   *          description: 현재 페이지(기본 1)
   *          required: true
   *          schema:
   *            type: number
   *          example: 3
   *        - name: previousPage
   *          in: query
   *          description: 이전 페이지(기본 1)
   *          required: true
   *          schema:
   *            type: string
   *          example: 2
   *        - name: lastId
   *          in: query
   *          description: 조회된 리스트의 마지막 ID
   *          required: false
   *          schema:
   *            type: string
   *          example: '62f4999837ad67001405a6dd'
   *        - name: sort
   *          in: query
   *          description: '정렬. 필드는 ,로 구분하며 +는 오름차순, -는 내림차순 '
   *          required: false
   *          schema:
   *            type: string
   *          example: '-createdAt,+views'
   *        - name: position
   *          in: query
   *          description: '직군(FE: 프론트엔드, BE: 백엔드, DE: 디자이너, IOS: IOS, AND: 안드로이드, DEVOPS: DevOps, PM)'
   *          required: false
   *          schema:
   *            type: string
   *          example: 'FE,IOS'
   *        - name: type
   *          in: query
   *          description: '모집 구분(1 : 프로젝트, 2: 스터디)'
   *          required: false
   *          schema:
   *            type: string
   *          example: '1'
   *        - name: period
   *          in: query
   *          description: '조회 기간(일). 14일 경우 14일 이내의 글만 조회'
   *          required: false
   *          schema:
   *            type: string
   *          example: 14
   *        - name: isClosed
   *          in: query
   *          description: '마감여부(true, false)'
   *          required: false
   *          schema:
   *            type: string
   *          example: true
   *        - name: search
   *          in: query
   *          description: '검색'
   *          required: false
   *          schema:
   *            type: string
   *          example: '토이프로젝트'
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
   *                  posts:
   *                    type: array
   *                    items:
   *                      $ref: '#/components/schemas/Post'
   */
  // #endregion
  route.get(
    '/pagination',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { page, previousPage, lastId, sort, language, period, isClosed, type, position, search } = req.query;
      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const posts = await PostServiceInstance.findPostPagination(
        page,
        previousPage,
        lastId,
        sort,
        language,
        period,
        isClosed,
        type,
        position,
        search,
      );

      return res.status(200).json(posts);
    }),
  );

  // #region 글 상세에서 관련 글 추천
  /**
   * @swagger
   * paths:
   *   /posts/{id}/recommend:
   *    get:
   *      tags:
   *        - posts
   *      summary: 글 상세에서 관련 글 추천
   *      description: '사용자가 읽고 있는 글과 관련된 글을 추천한다. 같은 기술 스택인 글 / 조회수 순으로 정렬 / 사용자가 작성한 글을 제외하기 위해 access token 사용'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 글 Id
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
   *                  $ref: '#/components/schemas/Post'
   *        404:
   *          description: Post not found
   */
  // #endregion
  route.get(
    '/:id/recommend',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const { _id: userId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.recommendToUserFromPost(Types.ObjectId(postId), userId);
      // const post = await PostServiceInstance.findPopularPosts(Types.ObjectId(postId), userId);  // 무조건 인기글 순으로 조회

      return res.status(200).json(post);
    }),
  );

  // #region 글 상세 보기
  /**
   * @swagger
   * paths:
   *   /posts/{id}:
   *    get:
   *      tags:
   *        - posts
   *      summary: 글 상세 보기
   *      description: '글 상세 정보를 조회한다. 읽은 목록 추가를 위해 access token을 사용한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 글 Id
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
   *                  $ref: '#/components/schemas/Post'
   *        404:
   *          description: Post not found
   */
  // #endregion
  route.get(
    '/:id',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const { _id: userId } = req.user as IUser;
      const readList = req.cookies.RVIEW;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.findPostDetail(Types.ObjectId(postId));
      const { updateReadList, isAlreadyRead } = await PostServiceInstance.increaseView(
        Types.ObjectId(postId),
        userId,
        readList,
      );
      if (!isAlreadyRead) {
        // 쿠키는 당일만 유효
        const untilMidnight = new Date();
        untilMidnight.setHours(24, 0, 0, 0);
        res.cookie('RVIEW', updateReadList, {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
          expires: untilMidnight,
        });
      }
      return res.status(200).json(post);
    }),
  );

  // #region 글 등록
  /**
   * @swagger
   * paths:
   *   /posts:
   *    post:
   *      tags:
   *        - posts
   *      summary: 글 등록
   *      description: '신규 글을 등록한다.'
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
   *              $ref: '#/components/schemas/Post'
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
    checkPost,
    isPostValid,
    isAccessTokenValid,
    asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
      try {
        const postDTO = req.body;
        const { _id: userId } = req.user as IUser;

        const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
        const post = await PostServiceInstance.registerPost(userId, postDTO);
        return res.status(201).json(post);
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

  // #region 글 수정
  /**
   * @swagger
   * paths:
   *   /posts/{id}:
   *    patch:
   *      tags:
   *        - posts
   *      summary: 글 수정
   *      description: 글을 수정한다.
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
   *          example: '635a91e837ad67001412321a'
   *          schema:
   *            type: string
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Post'
   *      responses:
   *        200:
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
  route.patch(
    '/:id',
    isAccessTokenValid,
    checkPost,
    isPostValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { _id: tokenUserId, tokenType } = req.user as IUser;

      const postDTO = req.body;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.modifyPost(Types.ObjectId(id), tokenUserId, tokenType, postDTO);

      return res.status(200).json(post);
    }),
  );

  // #region 글 삭제
  /**
   * @swagger
   * paths:
   *   /posts/{id}:
   *    delete:
   *      tags:
   *        - posts
   *      summary: 글 삭제
   *      description: 글을 삭제한다.
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
    isPostIdValid,
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { _id: tokenUserId, tokenType } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      await PostServiceInstance.deletePost(Types.ObjectId(id), tokenUserId, tokenType);
      return res.status(204).json();
    }),
  );

  /**
   * @swagger
   * tags:
        - name: likes
          description: 글 관심 등록
   */
  // #region 좋아요 등록
  /**
   * @swagger
   * paths:
   *   /posts/likes:
   *    post:
   *      tags:
   *        - likes
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
   *                postId:
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
    isPostIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { postId } = req.body;
      const { _id: userId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.addLike(Types.ObjectId(postId), userId);

      return res.status(201).json({ likeUsers: post.likes });
    }),
  );

  /**
   * @swagger
   * paths:
   *   /posts/likes/{id}:
   *    delete:
   *      tags:
   *        - likes
   *      summary: 좋아요 삭제
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
   *          description: Post not found
   */
  route.delete(
    '/likes/:id',
    isAccessTokenValid,
    isPostIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id; // 사용자 id
      const { _id: userId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.deleteLike(Types.ObjectId(postId), userId);
      return res.status(201).json({ likeUsers: post.likes });
    }),
  );

  /**
   * @swagger
   * paths:
   *   /posts/{id}/isLiked:
   *    get:
   *      tags:
   *        - likes
   *      summary: 사용자의 글 관심 등록 여부
   *      description: '사용자가 글에 관심 등록을 눌렀는지 여부를 조회한다. 사용자 정보는 access token을 이용해 확인한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 글 Id
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
   *                  isLiked:
   *                    type: boolean
   *                    description : 'true, false'
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  route.get(
    '/:id/isLiked',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const { _id: userId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const isLiked = await PostServiceInstance.findUserLiked(Types.ObjectId(postId), userId);

      return res.status(200).json({
        isLiked,
      });
    }),
  );

  /**
   * @swagger
   * paths:
   *   /posts/{id}/likes:
   *    get:
   *      tags:
   *        - likes
   *      summary: 글의 관심 등록한 사용자 리스트 조회
   *      description: '사용자가 글에 관심 등록한 사용자 리스트를 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 글 Id
   *          required: true
   *          example: '61063af4ed4b420bbcfa0b4c'
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
   *                  likeUsers:
   *                    type: array
   *                    description: 사용자 리스트
   *                    items:
   *                      type: string
   */
  route.get(
    '/:id/likes',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const likeUsers = await PostServiceInstance.findLikeUsers(Types.ObjectId(postId));

      return res.status(200).json({
        likeUsers,
      });
    }),
  );
};
