import { Model, Schema, model, Types } from 'mongoose';
import { signJWT } from '../utills/jwt';
import { Post as PostModel } from './Post';
import { Notification as NotificationModel } from './Notification';

export interface IUser {
  _id: Types.ObjectId;
  idToken: string;
  tokenType: string;
  email: string | undefined;
  name: string;
  nickName: string;
  password: string | undefined;
  image: string;
  likeLanguages: string[] | undefined;
  likePosts: Types.ObjectId[] | undefined;
  readList: Types.ObjectId[] | undefined;
}

export interface IUserDocument extends IUser, Document {
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
}

export interface IUserModel extends Model<IUserDocument> {
  deleteUser: (id: Types.ObjectId) => void;
  modifyUser: (id: Types.ObjectId, user: IUserDocument) => Promise<IUserDocument>;
  findByIdToken: (idToken: string) => Promise<IUserDocument>;
  findByEmail: (email: string) => Promise<IUserDocument>;
  findByNickName: (name: string) => Promise<IUserDocument>;
  addLikePost: (postId: Types.ObjectId, userId: Types.ObjectId) => Promise<IUserDocument>;
  deleteLikePost: (postId: Types.ObjectId, userId: Types.ObjectId) => Promise<IUserDocument>;
  addReadList: (postId: Types.ObjectId, userId: Types.ObjectId) => void;
}

const userSchema = new Schema<IUserDocument>(
  {
    idToken: { type: String, required: true },
    tokenType: { type: String, required: true },
    email: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      maxlength: 50,
      required: true,
    },
    nickName: {
      type: String,
      maxlength: 100,
    },
    password: {
      type: String,
      minlength: 8,
    },
    image: String,
    likeLanguages: [String],
    likePosts: [{ type: Types.ObjectId, ref: 'Post' }],
    readList: [{ type: Types.ObjectId, ref: 'Post' }],
  },
  {
    timestamps: true,
  },
);

userSchema.post('findOneAndDelete', async function (user: IUserDocument) {
  // 사용자가 작성한 글 제거
  await PostModel.deleteMany({ author: user._id });
  // 사용자가 작성한 댓글 제거
  await PostModel.findOneAndUpdate(
    { comments: { $elemMatch: { author: user._id } } },
    { $pull: { comments: { author: user._id } } },
  );

  // 사용자가 작성한 대댓글 제거
  await PostModel.findOneAndUpdate(
    { 'comments.replies': { $elemMatch: { author: user._id } } },
    { $pull: { 'comments.$.replies': { author: user._id } } },
  );

  // 회원 탈퇴 시 관련 알림 제거
  await NotificationModel.deleteNotificationByUser(user._id);
});

// userSchema.statics.deleteUser = async function (id) {
//   const user: IUserDocument = await this.findOne({ _id: id });
//   await user.remo();
// };

userSchema.statics.modifyUser = async function (id, user) {
  const userRecord = await this.findByIdAndUpdate(id, user, {
    new: true,
  });
  return userRecord;
};

userSchema.statics.findByIdToken = async function (idToken) {
  const result = await this.findOne({ idToken });
  return result;
};

userSchema.statics.findByEmail = async function (email) {
  const result = await this.findOne({ email });
  return result;
};

userSchema.statics.findByNickName = async function (nickName) {
  const result = await this.findOne({ nickName });
  return result;
};

userSchema.methods.generateAccessToken = async function () {
  const accessToken = await signJWT({ nickName: this.nickName, idToken: this.idToken }, '1h');

  return accessToken;
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = await signJWT({ nickName: this.nickName }, '2w');

  return refreshToken;
};

userSchema.statics.addLikePost = async function (postId, userId) {
  const result = await this.findByIdAndUpdate(
    { _id: userId },
    {
      $push: {
        likePosts: {
          _id: postId,
        },
      },
    },
    {
      new: true,
      upsert: true,
    },
  );
  return result;
};

userSchema.statics.deleteLikePost = async function (postId, userId) {
  const deleteRecord = await this.findOneAndUpdate(
    { _id: userId },
    {
      $pull: { likePosts: postId },
    },
  );
  return deleteRecord;
};

userSchema.statics.addReadList = async function (postId, userId) {
  const isPostExists = await this.findOne({ _id: userId, readList: postId });
  if (!isPostExists) {
    await this.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          readList: {
            _id: postId,
          },
        },
      },
    );
  }
};

const User = model<IUserDocument, IUserModel>('User', userSchema);
export { User };
