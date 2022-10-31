import { Model, Schema, model, Types } from 'mongoose';

export interface IPostFilterLog {
  viewDate: Date;
  language: [string];
}

export interface IPostFilterLogDocument extends IPostFilterLog, Document {}

export type IPostFilterLogModel = Model<IPostFilterLogDocument>;

const PostFilterLogSchema = new Schema<IPostFilterLogDocument>({
  viewDate: Date,
  language: { type: [String] }, // 언어
});

const PostFilterLog = model<IPostFilterLogDocument, IPostFilterLogModel>('PostFilterLog', PostFilterLogSchema);
export { PostFilterLog };
