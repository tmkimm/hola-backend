import { Model, Schema, model, Types } from 'mongoose';

export interface ILikePosts {
  viewDate: Date;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
}

export interface ILikePostsDocument extends ILikePosts, Document {}

export interface ILikePostsModel extends Model<ILikePostsDocument> {
  add: (postId: Types.ObjectId, userId: Types.ObjectId) => void;
  delete: (postId: Types.ObjectId, userId: Types.ObjectId) => void;
}

const LikePostsSchema = new Schema<ILikePostsDocument>(
  {
    userId: { type: Types.ObjectId, ref: 'Post' },
    postId: { type: Types.ObjectId, ref: 'Post' },
  },
  {
    timestamps: true,
  },
);

LikePostsSchema.statics.add = async function (postId, userId) {
  await this.create({
    userId,
    postId,
  });
};

LikePostsSchema.statics.delete = async function (postId, userId) {
  await this.deleteOne({ userId, postId });
};

const LikePosts = model<ILikePostsDocument, ILikePostsModel>('LikePosts', LikePostsSchema);
export { LikePosts };
