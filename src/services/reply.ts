import { Types } from 'mongoose';
import { IReplyDocument, IPostModel, IComment, Post as PostModel } from '../models/Post';
import { Notification as NotificationModel } from '../models/Notification';

// 신규 대댓글을 추가한다.
const registerReply = async (
  userID: Types.ObjectId,
  postId: Types.ObjectId,
  commentId: Types.ObjectId,
  content: string,
  nickName: string,
) => {
  const { post, replyId } = await PostModel.registerReply(postId, commentId, content, userID);

  // 대댓글 등록 시 댓글 등록자에게 달림 추가
  const author = await PostModel.findAuthorByCommentId(commentId);
  if (author !== null)
    // await NotificationModel.registerNotification(postId, author, userID, 'reply', replyId, nickName); // 알림 등록

    return post;
};

// 대댓글을 수정한다.
const modifyReply = async (comment: IReplyDocument, tokenUserId: Types.ObjectId) => {
  await PostModel.checkReplyAuthorization(comment._id, tokenUserId);
  const commentRecord = await PostModel.modifyReply(comment);
  return commentRecord;
};

// 대댓글을 삭제한다.
const deleteReply = async (replyId: Types.ObjectId, userId: Types.ObjectId) => {
  await PostModel.checkReplyAuthorization(replyId, userId);
  const author = await PostModel.findAuthorByReplyId(replyId);
  const postRecord = await PostModel.deleteReply(replyId);
  // await NotificationModel.deleteNotification(replyId); // 알림 삭제
};

export { registerReply, modifyReply, deleteReply };
