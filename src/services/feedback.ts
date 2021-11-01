import { IFeedbackModel } from '../models/Feedback';

export class FeedbackService {
  constructor(protected feedbackModel: IFeedbackModel) {}

  // 신규 스터디를 등록한다.
  async registerFeedback(rating: number, content: string) {
    const feedbackRecord = await this.feedbackModel.create({
      rating,
      content,
    });
    return feedbackRecord;
  }
}
