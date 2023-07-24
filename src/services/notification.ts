import { Types } from 'mongoose';
import { INotification, INotificationDocument, INotificationModel } from '../models/Notification';
import { timeForCreatedAt } from '../utills/timeForCreatedAt';

export class NotificationService {
  constructor(protected notificationModel: INotificationModel) {}

  // 알림 리스트를 조회한다.
  async findNotifications(userId: Types.ObjectId) {
    const notice: INotificationDocument[] = await this.notificationModel.findNotifications(userId);
    // 시간 전 계산
    const result = notice.map((item: INotificationDocument) => {
      item.timeAgo = timeForCreatedAt(item.createdAt);
      return item;
    })
    return result;
  }

  // 읽지 않은 알림 수를 조회한다.
  async findUnReadCount(author: Types.ObjectId) {
    const notice = await this.notificationModel.findUnReadCount(author);
    return notice;
  }

  // 알림 읽음 처리
  async readNotification(_id: Types.ObjectId) {
    await this.notificationModel.readNotification(_id);
  }

  // 알림 전체 읽음 처리
  async readAll(targetUserId: Types.ObjectId) {
    await this.notificationModel.readAll(targetUserId);
  }

    // 회원 가입 알림
  async createSignUpNotice(targetUserId: Types.ObjectId, nickName: string) {
    let icon = `👋`;
    let urn = `/setting`;
    let title = `${nickName}님 반가워요 🥳 올라에서 원하는 팀원을 만나보세요 :)`;
    let buttonLabel = `프로필 완성하기`;
    await this.notificationModel.createNotification('signup', targetUserId, urn, title, icon, buttonLabel);
  }

  // 댓글 알림
  async createCommentNotice(targetUserId: Types.ObjectId, nickName: string, postId: Types.ObjectId, createUserId: Types.ObjectId, createObjectId: Types.ObjectId, commentContent: string) {
    let icon = `💬`;
    let urn = `/study/${postId.toString()}`;
    let title = `${nickName}이 댓글을 남겼어요: ${commentContent}`;
    let buttonLabel = `확인하기`;
    await this.notificationModel.createNotification('comment', targetUserId, urn, title, icon, buttonLabel, createUserId, createObjectId, postId);
  }
  
  async modifyCommentContent(commentId: Types.ObjectId, nickName: string, content: string) {
    let title = `${nickName}이 댓글을 남겼어요: ${content}`;
    await this.notificationModel.modifyNotificationTitle(commentId, title);
  }
}
