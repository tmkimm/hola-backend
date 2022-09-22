import { Model, Schema, model, Types } from 'mongoose';

interface INotification {
  title: string;
  content: string;
  isRead: boolean;
  targetUserId: Types.ObjectId;
  generateUserId: Types.ObjectId;
  generateObjectId: Types.ObjectId;
  href: string;
  readAt?: Date;
  noticeType: string;
}

export interface INotificationDocument extends INotification, Document {}

export interface INotificationModel extends Model<INotificationDocument> {
  findNotifications: (targetUserId: Types.ObjectId) => Promise<INotificationDocument>;
  findNotification: (_id: Types.ObjectId) => Promise<INotificationDocument>;
  findUnReadCount: (targetUserId: Types.ObjectId) => Promise<number>;
  registerNotification: (
    postId: Types.ObjectId,
    targetUserId: Types.ObjectId,
    generateUserId: Types.ObjectId,
    noticeType: string,
    generateObjectId: Types.ObjectId,
    nickName: string,
  ) => Promise<void>;
  deleteNotification: (generateObjectId: Types.ObjectId) => Promise<void>;
  deleteNotificationByPost: (href: Types.ObjectId) => Promise<void>;
  deleteNotificationByUser: (userId: Types.ObjectId) => Promise<void>;
  readNotification: (_id: Types.ObjectId) => Promise<void>;
  readAll: (targetUserId: Types.ObjectId) => Promise<void>;
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, default: null }, // 알림 타이틀
    content: { type: String, default: null }, // 알림 내용
    isRead: { type: Boolean, default: false }, // 읽음 여부
    targetUserId: { type: Types.ObjectId, ref: 'User' }, // 알림 받을사람 id
    generateUserId: { type: Types.ObjectId, ref: 'User' }, // 알림 보낸사람 id
    generateObjectId: { type: Types.ObjectId }, // 알림 발생한 곳  Id(글, 댓글 등)
    href: { type: String, default: null }, // 이동할 링크
    readAt: Date, // 읽은 시간
    noticeType: String, // 알림 구분(like, comment, reply, couphone, notice)
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

// 알림 리스트 조회
notificationSchema.statics.findNotifications = async function (
  targetUserId: Types.ObjectId,
): Promise<INotificationDocument> {
  // let limit = 5;
  // const unReadCount = await this.countDocuments({ targetUserId, isRead: false });
  // if (unReadCount >= 6) limit = unReadCount;

  const result = await this.find({ targetUserId })
    .populate('generateUserId', 'nickName')
    // .populate({ path: 'postId', match: { isDeleted: false }, select: 'title' })
    .sort('+isRead -createdAt')
    .select(`title content isRead href generateUserId noticeType createdAt`)
    // .limit(limit)
    .lean();
  return result;
};

// 알림 상세 조회
notificationSchema.statics.findNotification = async function (_id: Types.ObjectId): Promise<INotificationDocument> {
  const result = await this.findOne({ _id })
    .populate('generateUserId', 'nickName')
    .select(`title content isRead href generateUserId noticeType createdAt`);

  return result;
};

// 읽지 않은 알림 수 조회
notificationSchema.statics.findUnReadCount = async function (targetUserId: Types.ObjectId): Promise<number> {
  const unReadCount = await this.countDocuments({ targetUserId, isRead: false });
  return unReadCount;
};

// 신규 알림 등록
notificationSchema.statics.registerNotification = async function (
  postId: Types.ObjectId,
  targetUserId: Types.ObjectId,
  generateUserId: Types.ObjectId,
  noticeType: string,
  generateObjectId: Types.ObjectId,
  nickName: string,
): Promise<void> {
  const isNoticeExist = await this.findOne({ href: postId.toString(), generateUserId });

  let title: string;
  // // 알림 구분(like, comment, reply, couphone, notice)
  if (!isNoticeExist && targetUserId !== generateUserId) {
    switch (noticeType) {
      case 'like':
        title = `👀 ${nickName}님이 내 글을 북마크했어요.`;
        break;
      case 'comment':
        title = `👀 ${nickName}님이 내 글에 댓글을 남겼어요.`;
        break;
      case 'reply':
        title = `👀 ${nickName}님이 내 글에 답글을 남겼어요.`;
        break;
      default:
        title = ``;
        break;
    }
    await this.create({ targetUserId, generateUserId, href: postId, title, noticeType, generateObjectId });
  }
};

// 알림 삭제
notificationSchema.statics.deleteNotification = async function (generateObjectId: Types.ObjectId): Promise<void> {
  await this.deleteMany({ generateObjectId });
};

// 글 삭제 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByPost = async function (href: string): Promise<void> {
  await this.deleteMany({ href });
};

// 회원 탈퇴 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByUser = async function (userId: Types.ObjectId): Promise<void> {
  await this.deleteMany({ $or: [{ targetUserId: userId }, { generateUserId: userId }] });
};

// updateReadAt, updateReadAtByPost 분리하기

// 알림 읽음 처리
notificationSchema.statics.readNotification = async function (_id: Types.ObjectId): Promise<void> {
  await this.updateMany(
    {
      _id,
      isRead: false,
    },
    {
      readAt: new Date(),
      isRead: true,
    },
  );
};
// 알림 전체 읽음 처리
notificationSchema.statics.readAll = async function (targetUserId: Types.ObjectId): Promise<void> {
  await this.updateMany(
    {
      targetUserId,
      isRead: false,
    },
    {
      readAt: new Date(),
      isRead: true,
    },
  );
};

const Notification = model<INotificationDocument, INotificationModel>('Notification', notificationSchema);

export { Notification };
