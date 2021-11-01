import { Types } from 'mongoose';
import { INotificationModel } from '../models/Notification';

export class NotificationService {
  constructor(protected notificationModel: INotificationModel) {}

  // 내 알림을 조회한다.
  async findMyNotice(author: Types.ObjectId) {
    const notice = await this.notificationModel.findMyNotifications(author);
    return notice;
  }

  // 읽지 않은 알림 수를 조회한다.
  async findUnReadCount(author: Types.ObjectId) {
    const notice = await this.notificationModel.findUnReadCount(author);
    return notice;
  }
}
