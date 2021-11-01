import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
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
      const commentDTO = req.body;
      const userId = req.user._id;

      const ReplyServiceInstance = new ReplyService(StudyModel, NotificationModel);
      const study = await ReplyServiceInstance.registerReply(userId, commentDTO);

      res.status(201).json(study);
    }),
  );

  // 대댓글 수정
  route.patch(
    '/:id',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const commentDTO = req.body;
      commentDTO.id = req.params.id;
      const tokenUserId = req.user._id;

      const ReplyServiceInstance = new ReplyService(StudyModel, NotificationModel);
      const comment = await ReplyServiceInstance.modifyReply(commentDTO, tokenUserId);

      res.status(200).json(comment);
    }),
  );
  // 대댓글 삭제
  route.delete(
    '/:id',
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const replyId = req.params.id;
      const userId = req.user._id;

      const ReplyServiceInstance = new ReplyService(StudyModel, NotificationModel);
      await ReplyServiceInstance.deleteReply(Types.ObjectId(replyId), Types.ObjectId(userId));

      res.status(204).json();
    }),
  );
};
