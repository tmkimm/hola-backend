import { Types } from 'mongoose';
import AWS from 'aws-sdk';
import { IUserDocument, IUserModel } from '../models/User';
import { INotificationModel } from '../models/Notification';
import { IPostModel } from '../models/Post';
import config from '../config/index';
import CustomError from '../CustomError';

export class UserService {
  constructor(
    protected postModel: IPostModel,
    protected userModel: IUserModel,
    protected notificationModel: INotificationModel,
  ) {}

  // 닉네임을 이용하여 사용자 정보를 조회한다.
  async findByNickName(nickName: string) {
    const users = await this.userModel.findByNickName(nickName);
    return users;
  }

  // id를 이용하여 사용자 정보를 조회한다.
  async findById(id: Types.ObjectId) {
    const users = await this.userModel.findById(id);
    return users;
  }

  // 사용자 정보를 수정한다.
  // 닉네임을 기준으로 Token을 생성하기 때문에 Token을 재발급한다.
  async modifyUser(id: Types.ObjectId, tokenUserId: Types.ObjectId, user: IUserDocument) {
    if (id.toString() !== tokenUserId.toString())
      throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
    const userRecord = await this.userModel.modifyUser(id, user);
    const accessToken = await userRecord.generateAccessToken();
    const refreshToken = await userRecord.generateRefreshToken();
    return { userRecord, accessToken, refreshToken };
  }

  async deleteUser(id: Types.ObjectId, tokenUserId: Types.ObjectId) {
    if (id.toString() !== tokenUserId.toString())
      throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
    await this.userModel.findOneAndDelete({ _id: id });
  }

  // 사용자가 관심 등록한 글 리스트를 조회한다.
  async findUserLikes(id: Types.ObjectId) {
    const userLikes = await this.userModel
      .findById(id)
      .populate({
        path: 'likePosts',
        match: { isDeleted: false },
        options: { sort: { createdAt: -1 } },
      })
      .select('likePosts');
    return userLikes;
  }

  // 사용자의 읽은 목록을 조회한다.
  async findReadList(id: Types.ObjectId) {
    const readList = await this.userModel
      .findById(id)
      .populate({
        path: 'readList',
        match: { isDeleted: false },
        options: { sort: { createdAt: -1 } },
      })
      .select('readList');
    return readList;
  }

  // 사용자의 작성 목록을 조회한다.
  async findMyPosts(id: Types.ObjectId) {
    const myPosts = await this.postModel.find({ author: id, isDeleted: false }).sort('-createdAt');
    return myPosts;
  }

  // S3 Pre-Sign Url을 발급한다.
  // eslint-disable-next-line class-methods-use-this
  async getPreSignUrl(fileName: string) {
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
  }

  // 사용자의 읽은 목록을 추가한다.
  async addReadLists(postId: Types.ObjectId, userId: Types.ObjectId) {
    const user = await this.userModel.addReadList(postId, userId);
    return user;
  }
}
