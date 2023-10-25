import { Document, Model, Schema, model } from 'mongoose';

interface IFeedback {
  rating: number;
  content: string;
}

export interface IFeedbackDocument extends IFeedback, Document {}

export type IFeedbackModel = Model<IFeedbackDocument>;

const feedbackSchema = new Schema<IFeedback>(
  {
    rating: Number,
    content: String,
  },
  {
    timestamps: true,
  }
);

const Feedback = model<IFeedbackDocument, IFeedbackModel>('Feedback', feedbackSchema);
export { Feedback };
