import { Types } from 'mongoose';
import { IReplyDocument, IPostModel, IComment } from '../models/Post';
import { INotificationModel } from '../models/Notification';

export class ReplyService {
  constructor(protected postModel: IPostModel, protected notificationModel: INotificationModel) {}

  // 신규 대댓글을 추가한다.
  async registerReply(userID: Types.ObjectId, postId: Types.ObjectId, commentId: Types.ObjectId, content: string) {
    const { post, replyId } = await this.postModel.registerReply(postId, commentId, content, userID);

    // 대댓글 등록 시 댓글 등록자에게 달림 추가
    const author = await this.postModel.findAuthorByCommentId(commentId);
    if (author !== null) await this.notificationModel.registerNotification(postId, author, userID, 'reply', replyId); // 알림 등록

    return post;
  }

  // 대댓글을 수정한다.
  async modifyReply(comment: IReplyDocument, tokenUserId: Types.ObjectId) {
    await this.postModel.checkReplyAuthorization(comment._id, tokenUserId);
    const commentRecord = await this.postModel.modifyReply(comment);
    return commentRecord;
  }

  // 대댓글을 삭제한다.
  async deleteReply(replyId: Types.ObjectId, userId: Types.ObjectId) {
    await this.postModel.checkReplyAuthorization(replyId, userId);
    const author = await this.postModel.findAuthorByReplyId(replyId);
    const postRecord = await this.postModel.deleteReply(replyId);
    await this.notificationModel.deleteNotification(replyId); // 알림 삭제
  }
}
