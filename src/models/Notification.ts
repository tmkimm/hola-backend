import { Model, Schema, model, Types } from 'mongoose';

interface INotification {
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
}

export interface INotificationDocument extends INotification, Document {}

export interface INotificationModel extends Model<INotificationDocument> {
  findNotifications: (targetUserId: Types.ObjectId) => Promise<INotificationDocument>;
  findNotification: (_id: Types.ObjectId) => Promise<INotificationDocument>;
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
    readDate: Date, // 읽은 시간
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
    .sort('+isRead -createdAt')
    .select(`title isRead href createUserId noticeType createdAt icon`)
    .lean();
  return result;
};

// 알림 상세 조회
notificationSchema.statics.findNotification = async function (_id: Types.ObjectId): Promise<INotificationDocument> {
  const result = await this.findOne({ _id })
    .populate('createUserId', 'nickName')
    .select(`title isRead href createUserId noticeType createdAt icon`);

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

// updateReadAt, updateReadAtByPost 분리하기

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
