import sanitizeHtml from 'sanitize-html';
import { Types } from 'mongoose';
import { IPost, IPostModel, IPostDocument, Post as PostModel } from '../models/Post';
import { User as UserModel, IUserModel } from '../models/User';
import { Notification as NotificationModel } from '../models/Notification';
import { PostFilterLog as PostFilterLogModel } from '../models/PostFilterLog';
import { ReadPosts as ReadPostsModel } from '../models/ReadPosts';
import { LikePosts as LikePostsModel } from '../models/LikePosts';

import CustomError from '../CustomError';

// 리팩토링필요
// 메인 화면에서 글 리스트를 조회한다.
const findPost = async (
  offset: number | null,
  limit: number | null,
  sort: string | null,
  language: string | null,
  period: number | null,
  isClosed: string | null,
  type: string | null,
  position: string | null,
  search: string | null,
) => {
  const posts = await PostModel.findPost(offset, limit, sort, language, period, isClosed, type, position, search);
  // 언어 필터링 로그 생성
  // if (language) {
  //   await PostFilterLog.create({
  //     viewDate: new Date(),
  //     language: language.split(','),
  //   });
  // }
  return posts;
};

// 메인 화면에서 글 리스트를 조회한다.
const findPostPagination = async (
  page: string | null,
  sort: string | null,
  language: string | null,
  period: number | null,
  isClosed: string | null,
  type: string | null,
  position: string | null,
  search: string | null,
  userId: Types.ObjectId | null,
) => {
  const result: any = await PostModel.findPostPagination(
    page,
    sort,
    language,
    period,
    isClosed,
    type,
    position,
    search,
  );

  // mongoose document는 불변상태이기 때문에 POJO로 변환
  const documentToObject = result.posts.map((post: any) => {
    return post.toObject({ virtuals: true });
  });

  // 관심 등록 여부 추가
  let addIsLiked;
  // 로그인하지 않은 사용자
  if (userId == null) {
    addIsLiked = documentToObject.map((post: any) => {
      post.isLiked = false;
      return post;
    });
  } else {
    // 로그인한 사용자
    addIsLiked = documentToObject.map((post: any) => {
      let isLiked = false;
      if (post.likes && post.likes.length > 0) {
        // ObjectId 특성 상 IndexOf를 사용할 수 없어 loop로 비교(리팩토링 필요)
        for (const likeUserId of post.likes) {
          if (likeUserId.toString() == userId.toString()) {
            isLiked = true;
            break;
          }
        }
      }
      post.isLiked = isLiked;
      return post;
    });
  }
  result.posts = addIsLiked;

  // 언어 필터링 로그 생성
  // if (language) {
  //   await PostFilterLog.create({
  //     viewDate: new Date(),
  //     language: language.split(','),
  //   });
  // }
  return result;
};

// Pagination을 위해 마지막 페이지를 구한다.
const findLastPage = async (
  language: string | null,
  period: number | null,
  isClosed: string | null,
  type: string | null,
  position: string | null,
  search: string | null,
) => {
  const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
  const totalCount = await PostModel.countPost(language, period, isClosed, type, position, search);
  const lastPage = Math.ceil(totalCount / itemsPerPage);
  return lastPage;
};

// 인기글 조회
const findPopularPosts = async (postId: Types.ObjectId, userId: Types.ObjectId) => {
  const posts = await PostModel.findPopularPosts(postId, userId);
  return posts;
};

// 메인 화면에서 글를 추천한다.(현재 미사용, 제거예정)
const recommendToUserFromMain = async (userId: Types.ObjectId) => {
  let sort;
  let likeLanguages = null;
  const limit = 20;
  if (userId) {
    const user = await UserModel.findById(userId);
    if (user !== null && user.likeLanguages) likeLanguages = user.likeLanguages;
    sort = 'views';
  } else {
    sort = 'totalLikes';
  }

  const posts = await PostModel.findPostRecommend('-views', likeLanguages, null, null, limit);
  return posts;
};

// 글에서 글를 추천한다.
const recommendToUserFromPost = async (postId: Types.ObjectId, userId: Types.ObjectId) => {
  const sort = '-views';
  let language = null;
  const limit = 10;
  if (postId) {
    const post = await PostModel.findById(postId);
    if (post === null) throw new CustomError('JsonWebTokenError', 404, 'Post not found');

    language = post.language;
  }

  const posts = await PostModel.findPostRecommend(sort, language, postId, userId, limit);
  return posts;
};

// 조회수 증가
const increaseView = async (postId: Types.ObjectId, userId: Types.ObjectId, readList: string) => {
  let isAlreadyRead = true;
  let updateReadList = readList;
  // 조회수 중복 증가 방지
  if (readList === undefined || (typeof readList === 'string' && readList.indexOf(postId.toString()) === -1)) {
    if (userId)
      await Promise.all([
        await ReadPostsModel.create({
          userId,
          postId,
        }),
        PostModel.increaseView(postId),
      ]);
    else await PostModel.increaseView(postId); // 조회수 증가

    if (readList === undefined) updateReadList = `${postId}`;
    else updateReadList = `${readList}|${postId}`;
    isAlreadyRead = false;
  }
  return { updateReadList, isAlreadyRead };
};

// 상세 글 정보를 조회한다.
// 로그인된 사용자일 경우 읽은 목록을 추가한다.
const findPostDetail = async (postId: Types.ObjectId) => {
  const posts = await PostModel.findById(postId).populate('author', 'nickName image');
  if (!posts) throw new CustomError('NotFoundError', 404, 'Post not found');
  return posts;
};

// 사용자의 관심 등록 여부를 조회한다.
const findUserLiked = async (postId: Types.ObjectId, userId: Types.ObjectId) => {
  if (userId && postId) {
    const posts = await PostModel.find({ _id: postId, likes: userId });
    const isLiked = posts.length > 0;
    return isLiked;
  }
  return false;
};

// 글의 관심 등록한 사용자 리스트를 조회한다.
const findLikeUsers = async (postId: Types.ObjectId) => {
  const likeUsers = await PostModel.findById(postId).select('likes');
  if (!likeUsers) return [];
  return likeUsers.likes;
};

// 신규 글를 등록한다.
const registerPost = async (userID: Types.ObjectId, post: IPostDocument) => {
  post.author = userID;
  if (post.content) {
    const cleanHTML = sanitizeHtml(post.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    });
    post.content = cleanHTML;
  }
  const postRecord = await PostModel.create(post);
  return postRecord;
};

// 글 정보를 수정한다.
const modifyPost = async (id: Types.ObjectId, tokenUserId: Types.ObjectId, tokenType: string, post: IPost) => {
  await PostModel.checkPostAuthorization(id, tokenUserId, tokenType); // 접근 권한 체크
  if (post.content) {
    const cleanHTML = sanitizeHtml(post.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    });
    post.content = cleanHTML;
  }
  const postRecord = await PostModel.modifyPost(id, post);
  return postRecord;
};

// 글를 삭제한다.
const deletePost = async (id: Types.ObjectId, tokenUserId: Types.ObjectId, tokenType: string) => {
  await PostModel.checkPostAuthorization(id, tokenUserId, tokenType); // 접근 권한 체크
  await PostModel.deletePost(id);
  await NotificationModel.deleteNotificationByPost(id); // 글 삭제 시 관련 알림 제거
};

// 관심 등록 추가
const addLike = async (postId: Types.ObjectId, userId: Types.ObjectId) => {
  const { post, isLikeExist } = await PostModel.addLike(postId, userId);
  if (!isLikeExist) {
    await LikePostsModel.add(postId, userId);
    // await NotificationModel.registerNotification(postId, post.author, userId, 'like');   // 알림 등록
  }
  return post;
};

// 관심 등록 취소(삭제)
const deleteLike = async (postId: Types.ObjectId, userId: Types.ObjectId) => {
  const { post, isLikeExist } = await PostModel.deleteLike(postId, userId);
  if (isLikeExist) {
    await LikePostsModel.delete(postId, userId);
    // await this.notificationModel.deleteNotification(postId, post.author, userId, 'like');   // 알림 삭제
  }
  return post;
};

// 자동 마감
const autoClosing = async () => {
  await PostModel.autoClosing();
};

export {
  findPost,
  findPostPagination,
  findLastPage,
  findPopularPosts,
  recommendToUserFromMain,
  recommendToUserFromPost,
  increaseView,
  findPostDetail,
  findUserLiked,
  findLikeUsers,
  registerPost,
  modifyPost,
  deletePost,
  addLike,
  deleteLike,
  autoClosing,
};
