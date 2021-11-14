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
  /*
    댓글에 관련된 Router를 정의한다.
    등록 / 수정 / 삭제하려는 사용자의 정보는 Access Token을 이용하여 처리한다.

    # GET /posts/comments/:id : 글의 댓글 리스트 조회
    # POST /posts/comments : 신규 댓글 등록
    # PATCH /posts/comments/:id : 댓글 정보 수정
    # DELETE /posts/comments/:id : 댓글 삭제
    */
  app.use('/posts/comments', route);

  // 댓글 리스트 조회
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
  // 댓글 등록
  route.post(
    '/',
    isAccessTokenValid,
    isPostIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { postId, content } = req.body;
      const { _id: userId } = req.user as IUser;

      const CommentServiceInstance = new CommentService(PostModel, NotificationModel);
      const post = await CommentServiceInstance.registerComment(userId, postId, content);

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
      const { _id: tokenUserId } = req.user as IUser;

      const CommentServiceInstance = new CommentService(PostModel, NotificationModel);
      const comment = await CommentServiceInstance.modifyComment(commentDTO, tokenUserId);

      return res.status(200).json(comment);
    }),
  );

  // 댓글 삭제
  route.delete(
    '/:id',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const commentId = req.params.id;
      const { _id: userId } = req.user as IUser;

      const CommentServiceInstance = new CommentService(PostModel, NotificationModel);
      await CommentServiceInstance.deleteComment(Types.ObjectId(commentId), userId);
      return res.status(204).json();
    }),
  );
};
