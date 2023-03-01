import { Model, Schema, model, Types } from 'mongoose';

export interface IReadPosts {
  viewDate: Date;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
}

export interface IReadPostsDocument extends IReadPosts, Document {}

export type IReadPostsModel = Model<IReadPostsDocument>;

const ReadPostsSchema = new Schema<IReadPostsDocument>(
  {
    userId: { type: Types.ObjectId, ref: 'User' },
    postId: { type: Types.ObjectId, ref: 'Post' },
  },
  {
    timestamps: true,
  },
);

const ReadPosts = model<IReadPostsDocument, IReadPostsModel>('ReadPosts', ReadPostsSchema);
export { ReadPosts };
