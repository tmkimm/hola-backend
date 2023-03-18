import { Types } from 'mongoose';
import { Notification as NotificationModel } from '../models/Notification';

// 알림 리스트를 조회한다.
const findNotifications = async (userId: Types.ObjectId) => {
  const notice = await NotificationModel.findNotifications(userId);
  return notice;
};

// 알림을 조회한다.
const findNotification = async (_id: Types.ObjectId) => {
  const notice = await NotificationModel.findNotification(_id);
  return notice;
};

// 읽지 않은 알림 수를 조회한다.
const findUnReadCount = async (author: Types.ObjectId) => {
  const notice = await NotificationModel.findUnReadCount(author);
  return notice;
};

// 알림 읽음 처리
const readNotification = async (_id: Types.ObjectId) => {
  await NotificationModel.readNotification(_id);
};

// 알림 전체 읽음 처리
const readAll = async (targetUserId: Types.ObjectId) => {
  await NotificationModel.readAll(targetUserId);
};
export { findNotifications, findNotification, findUnReadCount, readNotification, readAll };
