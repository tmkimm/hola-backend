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

  // 댓글 수정
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

  // 댓글 삭제
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
