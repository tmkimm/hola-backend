import { Model, Schema, model, Types } from 'mongoose';
import { signJWT } from '../utills/jwt';
import { Post as PostModel } from './Post';
import { Notification as NotificationModel } from './Notification';

/**
 * @swagger
 *  components:
 *  schemas:
 *   User:
 *     properties:
 *      _id:
 *        type: string
 *        description: 사용자 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      idToken:
 *        type: string
 *        description: '사용자 토큰(Oauth용)'
 *        example: '1856444309'
 *      tokenType:
 *        type: string
 *        description: '로그인 종류(google, github, kakao, admin)'
 *        example: 'google'
 *      name:
 *        type: string
 *        description: 이름
 *        example: '김올라'
 *      nickName:
 *        type: string
 *        description: 이름
 *        example: 'hola'
 *      password:
 *        type: string
 *        description: 비밀번호(미사용)
 *        example: '1234'
 *      image:
 *        type: string
 *        description: '이미지 명(기본 : default.PNG)'
 *        example: 'default.PNG'
 *      likeLanguages:
 *        type: array
 *        items:
 *          type: string
 *        description: 관심 언어
 *        example:
 *          - react
 *          - java
 *      likePosts:
 *        type: array
 *        items:
 *          type: string
 *        description: 관심 등록 글(좋아요한 글)
 *      readList:
 *        type: array
 *        items:
 *          type: string
 *        description: 읽은 글
 *      position:
 *        type: string
 *        description: 직무
 *      introduce:
 *        type: string
 *        description: 자기소개
 *      workExperience:
 *        type: string
 *        description: 경력(n, 1, 2, 3, 4, mo ..)
 *      organizationName:
 *        type: string
 *        description: 소속
 *      organizationIsOpen:
 *        type: boolean
 *        description: 소속 공개 여부(true, false)
 *      urls:
 *        type: array
 *        properties:
 *          urlType:
 *            type: string
 *            description: url 종류(GitHub, Velog, Tistory, Notion, LinkedIn, Instargram, Brunch, Youtube ..)
 *            example: 'Velog'
 *          url:
 *            type: string
 *            description: url
 *            example: 'https://velog.io/@seeh_h'
 *      createdAt:
 *        type: string
 *        description: 생성일
 *        format: date-time
 *        example: "2022-01-30T08:30:00Z"
 *      updatedAt:
 *        type: string
 *        description: 수정일
 *        format: date-time
 *        example: "2022-01-30T08:30:00Z"
 */

export interface IUser {
  _id: Types.ObjectId;
  idToken: string;
  tokenType: string;
  email: string | undefined;
  name: string | undefined;
  nickName: string;
  password: string | undefined;
  image: string;
  likeLanguages: string[] | undefined;
  likePosts: Types.ObjectId[] | undefined;
  readList: Types.ObjectId[] | undefined;
  position: string;
  introduce: string;
  workExperience: string;
  organizationName: string;
  organizationIsOpen: boolean;
  urls: [
    {
      urlType: string;
      url: string;
    },
  ];
  createdAt: Date;
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
  deleteLikePost: (postId: Types.ObjectId, userId: Types.ObjectId) => Promise<IUserDocument>;
  addReadList: (postId: Types.ObjectId, userId: Types.ObjectId) => void;
}

const UrlSchema = new Schema({ urlType: String, url: String });

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
    position: { type: String, default: '' },
    introduce: { type: String, default: '' },
    workExperience: { type: String, default: '' },
    organizationName: { type: String, default: '' },
    organizationIsOpen: { type: Boolean, default: false },
    urls: [UrlSchema],
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
  const accessToken = await signJWT({ nickName: this.nickName, idToken: this.idToken, _id: this._id }, '1h');

  return accessToken;
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = await signJWT({ nickName: this.nickName }, '2w');

  return refreshToken;
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
