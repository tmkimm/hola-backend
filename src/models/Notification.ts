import { Model, Schema, model, ObjectId } from 'mongoose';

interface INotification {
  targetUserId: ObjectId;
  generateUserId: ObjectId;
  generateObjectId: ObjectId;
  studyId: ObjectId;
  readAt?: Date;
  isRead: boolean;
  noticeCode: string;
  noticeType: string;
}

interface INotificationDocument extends INotification, Document {}

interface INotificationModel extends Model<INotificationDocument> {
  findMyNotifications: (targetUserId: ObjectId) => Promise<INotificationDocument>;
  findUnReadCount: (targetUserId: ObjectId) => Promise<number>;
  registerNotification: (
    studyId: ObjectId,
    targetUserId: ObjectId,
    generateUserId: ObjectId,
    noticeType: string,
    generateObjectId: ObjectId,
  ) => void;
  deleteNotification: (generateObjectId: ObjectId) => void;
  deleteNotificationByStudy: (studyId: ObjectId) => void;
  deleteNotificationByUser: (userId: ObjectId) => void;
  updateReadAt: (studyId: ObjectId, userId: ObjectId) => void;
}

const notificationSchema = new Schema<INotification>(
  {
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User' }, // 대상자 정보
    generateUserId: { type: Schema.Types.ObjectId, ref: 'User' }, // 사용자 정보
    generateObjectId: { type: Schema.Types.ObjectId }, // 알림 대상 Object Id
    studyId: { type: Schema.Types.ObjectId, ref: 'Study' }, // 스터디 ID
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
notificationSchema.statics.findMyNotifications = async function (targetUserId) {
  let limit = 5;
  const unReadCount = await this.countDocuments({ targetUserId, isRead: false });
  if (unReadCount >= 6) limit = unReadCount;

  const result = await this.find({ targetUserId })
    .populate('generateUserId', 'nickName')
    .populate({ path: 'studyId', match: { isDeleted: false }, select: 'title' })
    .sort('+isRead -createdAt')
    .limit(limit)
    .lean();
  return result;
};

// 읽지 않은 알림 수 조회
notificationSchema.statics.findUnReadCount = async function (targetUserId) {
  const unReadCount = await this.countDocuments({ targetUserId, isRead: false });
  return unReadCount;
};

// 신규 알림 등록
// like : 좋아요, comment : 댓글, reply: 대댓글
notificationSchema.statics.registerNotification = async function (
  studyId,
  targetUserId,
  generateUserId,
  noticeType,
  generateObjectId,
) {
  const isNoticeExist = await this.findOne({ studyId, generateObjectId });
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
    await this.create({ targetUserId, generateUserId, studyId, noticeCode, noticeType, generateObjectId });
  }
};

// 알림 삭제
notificationSchema.statics.deleteNotification = async function (generateObjectId) {
  await this.deleteMany({ generateObjectId });
};

// 글 삭제 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByStudy = async function (studyId) {
  await this.deleteMany({ studyId });
};

// 회원 탈퇴 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByUser = async function (userId) {
  await this.deleteMany({ $or: [{ targetUserId: userId }, { generateUserId: userId }] });
};

// 알림 읽음 처리
notificationSchema.statics.updateReadAt = async function (studyId, userId) {
  await this.updateMany(
    {
      studyId,
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

export default Notification;
