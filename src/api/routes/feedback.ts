import { NextFunction, Request, Response, Router } from 'express';
import { Feedback as FeedbackModel } from '../../models/Feedback';
import { FeedbackService } from '../../services/index';

const route = Router();

export default (app: Router) => {
  /*
    글에 관련된 Router를 정의한다.
    등록 / 수정 / 삭제하려는 사용자의 정보는 Access Token을 이용하여 처리한다.
    */
  app.use('/feedback', route);

  // 피드백 등록
  route.post('/', async function (req: Request, res: Response, next: NextFunction) {
    const { rating, content } = req.body;

    const FeedbackServiceInstance = new FeedbackService(FeedbackModel);
    const feedback = await FeedbackServiceInstance.registerFeedback(rating, content);
    return res.status(201).json(feedback);
  });
};
