import { Model, Schema, model, Types } from 'mongoose';

interface INotification {
  targetUserId: Types.ObjectId;
  generateUserId: Types.ObjectId;
  generateObjectId: Types.ObjectId;
  postId: Types.ObjectId;
  readAt?: Date;
  isRead: boolean;
  noticeCode: string;
  noticeType: string;
}

export interface INotificationDocument extends INotification, Document {}

export interface INotificationModel extends Model<INotificationDocument> {
  findMyNotifications: (targetUserId: Types.ObjectId) => Promise<INotificationDocument>;
  findUnReadCount: (targetUserId: Types.ObjectId) => Promise<number>;
  registerNotification: (
    postId: Types.ObjectId,
    targetUserId: Types.ObjectId,
    generateUserId: Types.ObjectId,
    noticeType: string,
    generateObjectId: Types.ObjectId,
  ) => Promise<void>;
  deleteNotification: (generateObjectId: Types.ObjectId) => Promise<void>;
  deleteNotificationByPost: (postId: Types.ObjectId) => Promise<void>;
  deleteNotificationByUser: (userId: Types.ObjectId) => Promise<void>;
  updateReadAt: (postId: Types.ObjectId, userId: Types.ObjectId) => Promise<void>;
}

const notificationSchema = new Schema<INotification>(
  {
    targetUserId: { type: Types.ObjectId, ref: 'User' }, // 대상자 정보
    generateUserId: { type: Types.ObjectId, ref: 'User' }, // 사용자 정보
    generateObjectId: { type: Types.ObjectId }, // 알림 대상 Object Id
    postId: { type: Types.ObjectId, ref: 'Post' }, // 글 ID
    readAt: Date, // 읽은 시간
    isRead: { type: Boolean, default: false },
    noticeCode: String,
    noticeType: String,
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

// 내 알림 조회
notificationSchema.statics.findMyNotifications = async function (
  targetUserId: Types.ObjectId,
): Promise<INotificationDocument> {
  let limit = 5;
  const unReadCount = await this.countDocuments({ targetUserId, isRead: false });
  if (unReadCount >= 6) limit = unReadCount;

  const result = await this.find({ targetUserId })
    .populate('generateUserId', 'nickName')
    .populate({ path: 'postId', match: { isDeleted: false }, select: 'title' })
    .sort('+isRead -createdAt')
    .limit(limit)
    .lean();
  return result;
};

// 읽지 않은 알림 수 조회
notificationSchema.statics.findUnReadCount = async function (targetUserId: Types.ObjectId): Promise<number> {
  const unReadCount = await this.countDocuments({ targetUserId, isRead: false });
  return unReadCount;
};

// 신규 알림 등록
// like : 좋아요, comment : 댓글, reply: 대댓글
notificationSchema.statics.registerNotification = async function (
  postId: Types.ObjectId,
  targetUserId: Types.ObjectId,
  generateUserId: Types.ObjectId,
  noticeType: string,
  generateObjectId: Types.ObjectId,
): Promise<void> {
  const isNoticeExist = await this.findOne({ postId, generateObjectId });
  let noticeCode: string;
  if (!isNoticeExist && targetUserId !== generateUserId) {
    switch (noticeType) {
      case 'like':
        noticeCode = '0';
        break;
      case 'comment':
        noticeCode = '1';
        break;
      case 'reply':
        noticeCode = '2';
        break;
      default:
        noticeCode = '0';
        break;
    }
    // const noticeCode = noticeType === 'like' ? '0' : noticeType === 'comment' ? '1' : noticeType === 'reply' ? '2' : '';
    await this.create({ targetUserId, generateUserId, postId, noticeCode, noticeType, generateObjectId });
  }
};

// 알림 삭제
notificationSchema.statics.deleteNotification = async function (generateObjectId: Types.ObjectId): Promise<void> {
  await this.deleteMany({ generateObjectId });
};

// 글 삭제 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByPost = async function (postId: Types.ObjectId): Promise<void> {
  await this.deleteMany({ postId });
};

// 회원 탈퇴 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByUser = async function (userId: Types.ObjectId): Promise<void> {
  await this.deleteMany({ $or: [{ targetUserId: userId }, { generateUserId: userId }] });
};

// 알림 읽음 처리
notificationSchema.statics.updateReadAt = async function (
  postId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<void> {
  await this.updateMany(
    {
      postId,
      targetUserId: userId,
      readAt: undefined,
    },
    {
      readAt: new Date(),
      isRead: true,
    },
  );
};

const Notification = model<INotificationDocument, INotificationModel>('Notification', notificationSchema);

export { Notification };
