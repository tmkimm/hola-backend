import { Model, Schema, model } from 'mongoose';

interface IFeedback {
  rating: number;
  content: string;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    rating: Number,
    content: String,
  },
  {
    timestamps: true,
  },
);

const Feedback = model<IFeedback>('Feedback', feedbackSchema);
export default Feedback;
