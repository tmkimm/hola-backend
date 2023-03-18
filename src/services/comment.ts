import { Types } from 'mongoose';
import { ICommentDocument, IComment, IPostModel, Post as PostModel } from '../models/Post';

// 글 id를 이용해 댓글 리스트를 조회한다.
const findComments = async (id: Types.ObjectId) => {
  const comments = await PostModel.findComments(id);
  return comments;
};

// 신규 댓글 추가
const registerComment = async (userID: Types.ObjectId, postId: Types.ObjectId, content: string, nickName: string) => {
  const { post, commentId } = await PostModel.registerComment(postId, content, userID);
  // await this.notificationModel.registerNotification(postId, post.author, userID, 'comment', commentId, nickName); // 알림 등록
  return post;
};

// 댓글 수정한다.
const modifyComment = async (comment: ICommentDocument, tokenUserId: Types.ObjectId, tokenType: string) => {
  await PostModel.checkCommentAuthorization(comment._id, tokenUserId, tokenType);
  const commentRecord = await PostModel.modifyComment(comment);
  return commentRecord;
};

// 댓글 삭제한다.
const deleteComment = async (commentId: Types.ObjectId, userId: Types.ObjectId, tokenType: string) => {
  await PostModel.checkCommentAuthorization(commentId, userId, tokenType);
  const postRecord = await PostModel.deleteComment(commentId);
  // await this.notificationModel.deleteNotification(commentId); // 알림 삭제
};

export { findComments, registerComment, modifyComment, deleteComment };
