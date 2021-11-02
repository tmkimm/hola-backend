import { Types } from 'mongoose';
import { IReplyDocument, IStudyModel, IComment } from '../models/Study';
import { INotificationModel } from '../models/Notification';

export class ReplyService {
  constructor(protected studyModel: IStudyModel, protected notificationModel: INotificationModel) {}

  // 신규 대댓글을 추가한다.
  async registerReply(userID: Types.ObjectId, studyId: Types.ObjectId, commentId: Types.ObjectId, content: string) {
    const { study, replyId } = await this.studyModel.registerReply(studyId, commentId, content, userID);

    // 대댓글 등록 시 댓글 등록자에게 달림 추가
    const author = await this.studyModel.findAuthorByCommentId(commentId);
    if (author !== null) await this.notificationModel.registerNotification(studyId, author, userID, 'reply', replyId); // 알림 등록

    return study;
  }

  // 대댓글을 수정한다.
  async modifyReply(comment: IReplyDocument, tokenUserId: Types.ObjectId) {
    await this.studyModel.checkReplyAuthorization(comment._id, tokenUserId);
    const commentRecord = await this.studyModel.modifyReply(comment);
    return commentRecord;
  }

  // 대댓글을 삭제한다.
  async deleteReply(replyId: Types.ObjectId, userId: Types.ObjectId) {
    await this.studyModel.checkReplyAuthorization(replyId, userId);
    const author = await this.studyModel.findAuthorByReplyId(replyId);
    const studyRecord = await this.studyModel.deleteReply(replyId);
    await this.notificationModel.deleteNotification(replyId); // 알림 삭제
  }
}
