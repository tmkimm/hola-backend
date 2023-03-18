import { Types } from 'mongoose';
import AWS from 'aws-sdk';
import { IUserDocument, User as UserModel } from '../models/User';
import { ReadPosts as ReadPostsModel } from '../models/ReadPosts';
import { LikePosts as LikePostsModel } from '../models/LikePosts';
import { INotificationModel } from '../models/Notification';
import { Post as PostModel } from '../models/Post';
import config from '../config/index';
import CustomError from '../CustomError';
import { SignOutUser as SignOutUserModel } from '../models/SignOutUser';

// 닉네임을 이용하여 사용자 정보를 조회한다.
const findByNickName = async (nickName: string) => {
  const users = await UserModel.findByNickName(nickName);
  return users;
};

// id를 이용하여 사용자 정보를 조회한다.
const findById = async (id: Types.ObjectId) => {
  const users = await UserModel.findById(id);
  return users;
};

// 사용자 정보를 수정한다.
// 닉네임을 기준으로 Token을 생성하기 때문에 Token을 재발급한다.
const modifyUser = async (id: Types.ObjectId, tokenUserId: Types.ObjectId, user: IUserDocument) => {
  if (id.toString() !== tokenUserId.toString())
    throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
  const userRecord = await UserModel.modifyUser(id, user);
  const [accessToken, refreshToken] = await Promise.all([
    userRecord.generateAccessToken(),
    userRecord.generateRefreshToken(),
  ]);
  return { userRecord, accessToken, refreshToken };
};

// 회원 탈퇴
const deleteUser = async (id: Types.ObjectId, tokenUserId: Types.ObjectId) => {
  if (id.toString() !== tokenUserId.toString())
    throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
  const user: IUserDocument | null = await UserModel.findById(id);

  if (user) {
    // 탈퇴 유저 이력 생성
    await SignOutUserModel.create({
      idToken: user.idToken,
      tokenType: user.tokenType,
      nickName: user.nickName,
      signInDate: user.createdAt,
      signOutDate: new Date(),
      userId: user._id,
    });
    await UserModel.findOneAndDelete({ _id: id });
  }
};

// 사용자가 관심 등록한 글 리스트를 조회한다.
const findUserLikes = async (id: Types.ObjectId) => {
  const likePosts = await LikePostsModel.find({ userId: id })
    .populate({
      path: 'postId',
      select: `title views comments likes language isClosed totalLikes startDate endDate type onlineOrOffline contactType recruits expectedPeriod author positions createdAt`,
      match: { isDeleted: false },
      populate: { path: 'author', select: `nickName image` },
    })
    .sort('-createdAt');

  const result = likePosts.map((i) => {
    return i.postId;
  });
  return result;
};

// 사용자의 읽은 목록을 조회한다.
const findReadList = async (id: Types.ObjectId) => {
  const readList = await ReadPostsModel.find({ userId: id })
    .populate({
      path: 'postId',
      select: `title views comments likes language isClosed totalLikes startDate endDate type onlineOrOffline contactType recruits expectedPeriod author positions createdAt`,
      match: { isDeleted: false },
      populate: { path: 'author', select: `nickName image` },
    })
    .sort('-createdAt');

  const result = readList.map((i) => {
    return i.postId;
  });
  return result;
};
// 사용자의 작성 목록을 조회한다.
const findMyPosts = async (id: Types.ObjectId) => {
  const myPosts = await PostModel.find({ author: id, isDeleted: false })
    .populate('author', 'nickName image')
    .sort('-createdAt');
  return myPosts;
};

// S3 Pre-Sign Url을 발급한다.
// eslint-disable-next-line class-methods-use-this
const getPreSignUrl = async (fileName: string) => {
  const s3 = new AWS.S3({
    accessKeyId: config.S3AccessKeyId,
    secretAccessKey: config.S3SecretAccessKey,
    region: config.S3BucketRegion,
  });

  const params = {
    Bucket: config.S3BucketName,
    Key: fileName,
    Expires: 60 * 60 * 3,
  };

  const signedUrlPut = await s3.getSignedUrlPromise('putObject', params);
  return signedUrlPut;
};

// 사용자의 읽은 목록을 추가한다.
const addReadLists = async (postId: Types.ObjectId, userId: Types.ObjectId) => {
  const user = await UserModel.addReadList(postId, userId);
  return user;
};

export {
  findByNickName,
  findById,
  modifyUser,
  deleteUser,
  findUserLikes,
  findReadList,
  findMyPosts,
  getPreSignUrl,
  addReadLists,
};
