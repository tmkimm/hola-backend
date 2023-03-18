import { Feedback as FeedbackModel } from '../models/Feedback';

// 신규 글를 등록한다.
const registerFeedback = async (rating: number, content: string) => {
  const feedbackRecord = await FeedbackModel.create({
    rating,
    content,
  });
  return feedbackRecord;
};

export { registerFeedback };
