import { Types } from 'mongoose';
import { INotificationModel } from '../models/Notification';

export class NotificationService {
  constructor(protected notificationModel: INotificationModel) {}

  // 알림 리스트를 조회한다.
  async findNotifications(userId: Types.ObjectId) {
    const notice = await this.notificationModel.findNotifications(userId);
    return notice;
  }

  // 알림을 조회한다.
  async findNotification(_id: Types.ObjectId) {
    const notice = await this.notificationModel.findNotification(_id);
    return notice;
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
}
