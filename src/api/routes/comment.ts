import { Types } from 'mongoose';
import { Router, Request, Response, NextFunction } from 'express';
import { isAccessTokenValid } from '../middlewares/index';
import { CommentService } from '../../services/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Study as StudyModel } from '../../models/Study';
import { Notification as NotificationModel } from '../../models/Notification';
import CustomError from '../../CustomError';

const route = Router();
export default (app: Router) => {
  /*
    댓글에 관련된 Router를 정의한다.
    등록 / 수정 / 삭제하려는 사용자의 정보는 Access Token을 이용하여 처리한다.

    # GET /studies/comments/:id : 스터디의 댓글 리스트 조회
    # POST /studies/comments : 신규 댓글 등록
    # PATCH /studies/comments/:id : 댓글 정보 수정
    # DELETE /studies/comments/:id : 댓글 삭제
    */
  app.use('/studies/comments', route);

  // 댓글 리스트 조회
  route.get(
    '/:id',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new CustomError('InvalidApiError', 400, 'Invalid Api Parameter');
      }
      const CommentServiceInstance = new CommentService(StudyModel, NotificationModel);
      const comments = await CommentServiceInstance.findComments(Types.ObjectId(id));

      res.status(200).json(comments);
    }),
  );
  // 댓글 등록
  route.post(
    '/',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const commentDTO = req.body;
      const userId = req.user._id;

      const CommentServiceInstance = new CommentService(StudyModel, NotificationModel);
      const study = await CommentServiceInstance.registerComment(userId, commentDTO);

      res.status(201).json(study);
    }),
  );

  // 댓글 수정
  route.patch(
    '/:id',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const commentDTO = req.body;
      commentDTO.id = req.params.id;
      const tokenUserId = req.user._id;

      const CommentServiceInstance = new CommentService(StudyModel, NotificationModel);
      const comment = await CommentServiceInstance.modifyComment(commentDTO, tokenUserId);

      res.status(200).json(comment);
    }),
  );

  // 댓글 삭제
  route.delete(
    '/:id',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const commentId = req.params.id;
      const userId = req.user._id;

      const CommentServiceInstance = new CommentService(StudyModel, NotificationModel);
      await CommentServiceInstance.deleteComment(Types.ObjectId(commentId), Types.ObjectId(userId));
      res.status(204).json();
    }),
  );
};
