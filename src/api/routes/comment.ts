import { Types } from 'mongoose';
import { Router, Request, Response, NextFunction } from 'express';
import { isPostIdValid } from '../middlewares/isPostIdValid';
import { IUser } from '../../models/User';
import { isAccessTokenValid } from '../middlewares/index';
import { CommentService } from '../../services/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Post as PostModel } from '../../models/Post';
import { Notification as NotificationModel } from '../../models/Notification';
import CustomError from '../../CustomError';

const route = Router();
export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: comments
          description: 댓글에 관련된 API
   */

  /*
    # POST /posts/comments : 신규 댓글 등록
    # PATCH /posts/comments/:id : 댓글 정보 수정
    # DELETE /posts/comments/:id : 댓글 삭제
    */
  app.use('/posts/comments', route);

  // 댓글 리스트 조회

  /**
   * @swagger
   * paths:
   *   /posts/comments/{id}:
   *    get:
   *      tags:
   *        - comments
   *      summary: 댓글 리스트 조회
   *      description: 글의 댓글 리스트를 조회한다.
   *      parameters:
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
   *                  $ref: '#/components/schemas/Comment'
   */
  route.get(
    '/:id',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new CustomError('InvalidApiError', 400, 'Invalid Api Parameter');
      }
      const CommentServiceInstance = new CommentService(PostModel, NotificationModel);
      const comments = await CommentServiceInstance.findComments(Types.ObjectId(id));

      return res.status(200).json(comments);
    }),
  );

  /**
   * @swagger
   * paths:
   *   /posts/comments:
   *    post:
   *      tags:
   *        - comments
   *      summary: 댓글 등록
   *      description: '신규 댓글을 등록한다. 사용자 정보는 access token을 이용해 확인한다.'
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
   *                  description : '글 Id'
   *                  example: '610f3dac02f039c2d9d550d6'
   *                content:
   *                  type: string
   *                  description : '댓글 내용'
   *                  example: '지원했어요!'
   *      responses:
   *        201:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Post'
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   *        404:
   *          description: Post not found
   */
  route.post(
    '/',
    isAccessTokenValid,
    isPostIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { postId, content } = req.body;
      let { nickName } = req.body;
      const { _id: userId } = req.user as IUser;

      if (!nickName) nickName = `사용자`;
      const CommentServiceInstance = new CommentService(PostModel, NotificationModel);
      const post = await CommentServiceInstance.registerComment(userId, postId, content, nickName);

      return res.status(201).json(post);
    }),
  );

  // 댓글 수정.
  /**
   * @swagger
   * paths:
   *   /posts/comments/{id}:
   *    patch:
   *      tags:
   *        - comments
   *      summary: 댓글 수정
   *      description: 댓글을 수정한다.
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
   *              type: object
   *              properties:
   *                content:
   *                  type: string
   *                  description : '댓글 내용'
   *                  example: '지원했어요!'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Post'
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  route.patch(
    '/:id',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const commentDTO = req.body;
      commentDTO._id = req.params.id;
      const { _id: tokenUserId, tokenType } = req.user as IUser;

      const CommentServiceInstance = new CommentService(PostModel, NotificationModel);
      const comment = await CommentServiceInstance.modifyComment(commentDTO, tokenUserId, tokenType);

      return res.status(200).json(comment);
    }),
  );

  /**
   * @swagger
   * paths:
   *   /posts/comments/{id}:
   *    delete:
   *      tags:
   *        - comments
   *      summary: 댓글 삭제
   *      description: 댓글을 삭제한다.
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 댓글 Id
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
    '/:id',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const commentId = req.params.id;
      const { _id: userId, tokenType } = req.user as IUser;

      const CommentServiceInstance = new CommentService(PostModel, NotificationModel);
      await CommentServiceInstance.deleteComment(Types.ObjectId(commentId), userId, tokenType);
      return res.status(204).json();
    }),
  );
};
