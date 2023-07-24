import { Model, Schema, model, Types } from 'mongoose';

/**
 * @swagger
 *  components:
 *  schemas:
 *   Notification:
 *     properties:
 *      _id:
 *        type: string
 *        description: 알림 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      title:
 *        type: string
 *        description: '알림 title'
 *        example: '자바둘 님이 댓글을 남겼어요: 참여할래요!'
 *      isRead:
 *        type: boolean
 *        description: '읽음 여부(false: 읽지 않음, true: 읽음)'
 *        example: false
 *      href:
 *        type: string
 *        description: '하이퍼링크(클릭 시 이동)'
 *        example: 'http://localhost:3000/study/64be012194b3593f58bffcff'
 *      icon:
 *        type: string
 *        description: '아이콘'
 *        example: '💬'
 *      noticeType:
 *        type: string
 *        description: '알림 유형(comment: 댓글 등록 알림, signup: 회원 가입 알림)'
 *        example: 'comment'
 *      timeAgo:
 *        type: string
 *        description: '~시간 전, ~분 전'
 *        example: '2시간 전'
 *      createdAt:
 *        type: string
 *        description: 생성일
 *        format: date-time
 *        example: "2022-01-30T08:30:00Z"
 */

export interface INotification {
  title: string;
  isRead: boolean;
  targetUserId: Types.ObjectId;
  createUserId: Types.ObjectId;
  createObjectId: Types.ObjectId;
  href: string;
  readDate?: Date;
  noticeType: string;
  buttonType: string;
  buttonLabel: string;
  icon: string;
  timeAgo: string;
  createdAt: Date;
}

export interface INotificationDocument extends INotification, Document {}

export interface INotificationModel extends Model<INotificationDocument> {
  findNotifications: (targetUserId: Types.ObjectId) => Promise<INotificationDocument[]>;
  findUnReadCount: (targetUserId: Types.ObjectId) => Promise<number>;
  createNotification: (
    noticeType: string,
    targetUserId: Types.ObjectId,
    urn: string,
    title: string,
    icon: string,
    buttonLabel: string,
    createUserId?: Types.ObjectId,
    createObjectId?: Types.ObjectId,
    parentObjectId?: Types.ObjectId,
  ) => Promise<void>;  
  modifyNotificationTitle: (createObjectId: Types.ObjectId, title: string) => Promise<void>;
  deleteNotification: (createObjectId: Types.ObjectId) => Promise<void>;
  deleteNotificationByPost: (href: Types.ObjectId) => Promise<void>;
  deleteNotificationByUser: (userId: Types.ObjectId) => Promise<void>;
  readNotification: (_id: Types.ObjectId) => Promise<void>;
  readAll: (targetUserId: Types.ObjectId) => Promise<void>;
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, default: null }, // 알림 타이틀
    isRead: { type: Boolean, default: false }, // 읽음 여부
    targetUserId: { type: Types.ObjectId, ref: 'User' }, // 알림 받을사람 id
    createUserId: { type: Types.ObjectId, ref: 'User' }, // 알림 보낸사람 id
    href: { type: String, default: null }, // 이동할 링크
    readDate: {type: Date, default: null}, // 읽은 시간
    buttonType: { type: String, default: 'BUTTON' },
    buttonLabel: { type: String, default: null },
    noticeType: String, // 알림 구분(like, comment, reply, couphone, notice)
    createObjectId: { type: Types.ObjectId }, // 알림 대상 Object Id(글, 댓글 등)
    parentObjectId: { type: Types.ObjectId },   // 알림 발생한 곳 Id(삭제 용도)
    icon: String,
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
  const today: Date = new Date();
  const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));

  const result = await this.find({ targetUserId, createdAt: { $gte: oneMonthAgo} })
    .populate('createUserId', 'nickName')
    .sort('isRead -createdAt')
    .select(`title isRead href createUserId noticeType createdAt icon`)
    .lean();
  return result;
};

// 읽지 않은 알림 수 조회
notificationSchema.statics.findUnReadCount = async function (targetUserId: Types.ObjectId): Promise<number> {
  const today: Date = new Date();
  const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
  const unReadCount = await this.countDocuments({ targetUserId, isRead: false, createdAt: { $gte: oneMonthAgo} });
  return unReadCount;
};


// 신규 알림 등록
notificationSchema.statics.createNotification = async function (
  noticeType: string,
  targetUserId: Types.ObjectId,
  urn: string,
  title: string,
  icon: string,
  buttonLabel: string,
  createUserId?: Types.ObjectId,
  createObjectId?: Types.ObjectId,
  parentObjectId?: Types.ObjectId,
): Promise<void> {
  let domain: string = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://holaworld.io';
  let href = domain + urn;
  await this.create({ targetUserId, createUserId, href, title, noticeType, createObjectId, buttonLabel, parentObjectId, icon });
};

// 알림 삭제
notificationSchema.statics.modifyNotificationTitle = async function (createObjectId: Types.ObjectId, title): Promise<void> {
  await this.findOneAndUpdate({createObjectId}, {title: title});
};

// 알림 삭제
notificationSchema.statics.deleteNotification = async function (createObjectId: Types.ObjectId): Promise<void> {
  await this.deleteMany({ createObjectId });
};

// 글 삭제 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByPost = async function (postId: string): Promise<void> {
  await this.deleteMany({ parentObjectId:postId });
};

// 회원 탈퇴 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByUser = async function (userId: Types.ObjectId): Promise<void> {
  await this.deleteMany({ $or: [{ targetUserId: userId }, { createUserId: userId }] });
};

// 알림 읽음 처리
notificationSchema.statics.readNotification = async function (_id: Types.ObjectId): Promise<void> {
  await this.updateMany(
    {
      _id,
      isRead: false,
    },
    {
      readDate: new Date(),
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
      readDate: new Date(),
      isRead: true,
    },
  );
};

const Notification = model<INotificationDocument, INotificationModel>('Notification', notificationSchema);

export { Notification };
