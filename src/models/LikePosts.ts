import { Model, Schema, model, Types } from 'mongoose';

export interface ILikePosts {
  viewDate: Date;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
}

export interface ILikePostsDocument extends ILikePosts, Document {}

export type ILikePostsModel = Model<ILikePostsDocument>;

const LikePostsSchema = new Schema<ILikePostsDocument>({
  viewDate: Date,
  userId: { type: Types.ObjectId, ref: 'Post' },
  postId: { type: Types.ObjectId, ref: 'Post' },
});

const LikePosts = model<ILikePostsDocument, ILikePostsModel>('LikePosts', LikePostsSchema);
export { LikePosts };
