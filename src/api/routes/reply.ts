import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { IUser } from '../../models/User';
import { isAccessTokenValid } from '../middlewares/index';
import { ReplyService } from '../../services/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Study as StudyModel } from '../../models/Study';
import { Notification as NotificationModel } from '../../models/Notification';

const route = Router();

export default (app: Router) => {
  /*
    대댓글에 관련된 Router를 정의한다.
    등록 / 수정 / 삭제하려는 사용자의 정보는 Access Token을 이용하여 처리한다.

    # POST /studies/replies : 신규 대댓글 등록
    # PATCH /studies/replies/:id : 대댓글 정보 수정
    # DELETE /studies/replies/:id : 대댓글 삭제
    */
  app.use('/studies/replies', route);

  // 대댓글 등록
  route.post(
    '/',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { studyId, commentId, content } = req.body;
      const { _id: userId } = req.user as IUser;

      const ReplyServiceInstance = new ReplyService(StudyModel, NotificationModel);
      const study = await ReplyServiceInstance.registerReply(userId, studyId, commentId, content);

      return res.status(201).json(study);
    }),
  );

  // 대댓글 수정
  route.patch(
    '/:id',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const commentDTO = req.body;
      commentDTO._id = req.params.id;
      const { _id: tokenUserId } = req.user as IUser;

      const ReplyServiceInstance = new ReplyService(StudyModel, NotificationModel);
      const comment = await ReplyServiceInstance.modifyReply(commentDTO, tokenUserId);

      return res.status(200).json(comment);
    }),
  );
  // 대댓글 삭제
  route.delete(
    '/:id',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const replyId = req.params.id;
      const { _id: userId } = req.user as IUser;

      const ReplyServiceInstance = new ReplyService(StudyModel, NotificationModel);
      await ReplyServiceInstance.deleteReply(Types.ObjectId(replyId), userId);

      return res.status(204).json();
    }),
  );
};
