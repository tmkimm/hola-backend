import { Types } from 'mongoose';
import { ICommentDocument, IComment, IPostModel } from '../models/Post';
import { INotificationModel } from '../models/Notification';

export class CommentService {
  constructor(protected postModel: IPostModel, protected notificationModel: INotificationModel) {
    this.postModel = postModel;
    this.notificationModel = notificationModel;
  }

  // 글 id를 이용해 댓글 리스트를 조회한다.
  async findComments(id: Types.ObjectId) {
    const comments = await this.postModel.findComments(id);
    return comments;
  }

  // 신규 댓글을 추가한다.
  async registerComment(userID: Types.ObjectId, postId: Types.ObjectId, content: string, nickName: string) {
    const { post, commentId } = await this.postModel.registerComment(postId, content, userID);
    //await this.notificationModel.createCommentNotice(postId, post.author, userID, 'comment', commentId, nickName); // 알림 등록
    return {post, commentId};
  }

  // 댓글을 수정한다.
  async modifyComment(comment: ICommentDocument, tokenUserId: Types.ObjectId, tokenType: string) {
    await this.postModel.checkCommentAuthorization(comment._id, tokenUserId, tokenType);
    const commentRecord = await this.postModel.modifyComment(comment);
    return commentRecord;
  }

  // 댓글을 삭제한다.
  async deleteComment(commentId: Types.ObjectId, userId: Types.ObjectId, tokenType: string) {
    await this.postModel.checkCommentAuthorization(commentId, userId, tokenType);
    const postRecord = await this.postModel.deleteComment(commentId);
    await this.notificationModel.deleteNotification(commentId); // 알림 삭제
  }
}
