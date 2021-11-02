import { Types } from 'mongoose';
import { ICommentDocument, IComment, IStudyModel } from '../models/Study';
import { INotificationModel } from '../models/Notification';

export class CommentService {
  constructor(protected studyModel: IStudyModel, protected notificationModel: INotificationModel) {
    this.studyModel = studyModel;
    this.notificationModel = notificationModel;
  }

  // 스터디 id를 이용해 댓글 리스트를 조회한다.
  async findComments(id: Types.ObjectId) {
    const comments = await this.studyModel.findComments(id);
    return comments;
  }

  // 신규 댓글을 추가한다.
  async registerComment(userID: Types.ObjectId, studyId: Types.ObjectId, content: string) {
    const { study, commentId } = await this.studyModel.registerComment(studyId, content, userID);
    await this.notificationModel.registerNotification(studyId, study.author, userID, 'comment', commentId); // 알림 등록
    return study;
  }

  // 댓글을 수정한다.
  async modifyComment(comment: ICommentDocument, tokenUserId: Types.ObjectId) {
    await this.studyModel.checkCommentAuthorization(comment._id, tokenUserId);
    const commentRecord = await this.studyModel.modifyComment(comment);

    return commentRecord;
  }

  // 댓글을 삭제한다.
  async deleteComment(commentId: Types.ObjectId, userId: Types.ObjectId) {
    await this.studyModel.checkCommentAuthorization(commentId, userId);

    const studyRecord = await this.studyModel.deleteComment(commentId);
    await this.notificationModel.deleteNotification(commentId); // 알림 삭제
  }
}
