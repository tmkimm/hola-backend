import { Model, Schema, model, Types } from 'mongoose';

export interface IReadPosts {
  viewDate: Date;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
}

export interface IReadPostsDocument extends IReadPosts, Document {}

export interface IReadPostsModel extends Model<IReadPostsDocument> {
  insertIfNotExist: (postId: Types.ObjectId, userId: Types.ObjectId) => void;
}

const ReadPostsSchema = new Schema<IReadPostsDocument>(
  {
    userId: { type: Types.ObjectId, ref: 'User' },
    postId: { type: Types.ObjectId, ref: 'Post' },
  },
  {
    timestamps: true,
  },
);

ReadPostsSchema.statics.insertIfNotExist = async function (postId, userId) {
  await this.updateOne(
    { postId, userId },
    {
      $setOnInsert: {
        userId,
        postId,
      },
    },
    { upsert: true },
  );
};

const ReadPosts = model<IReadPostsDocument, IReadPostsModel>('ReadPosts', ReadPostsSchema);
export { ReadPosts };
