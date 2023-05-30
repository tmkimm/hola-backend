import sanitizeHtml from 'sanitize-html';
import { Types } from 'mongoose';
import { IPost, IPostModel, IPostDocument } from '../models/Post';
import { INotificationModel } from '../models/Notification';
import { PostFilterLog } from '../models/PostFilterLog';
import { ReadPosts } from '../models/ReadPosts';
import { LikePosts } from '../models/LikePosts';

import { IUserModel } from '../models/User';
import CustomError from '../CustomError';

export class PostService {
  constructor(
    protected postModel: IPostModel,
    protected userModel: IUserModel,
    protected notificationModel: INotificationModel,
  ) {}

  // 이번주 인기글 조회
  async findTopPost() {
    const posts = await this.postModel.findTopPost(10, '-views');

    const today: Date = new Date();

    // mongoose document는 불변상태이기 때문에 POJO로 변환
    const postArr: any = posts.map((post: any) => {
      post = post.toObject({ virtuals: true });
      if (post.startDate > today) {
        post.badge = [
          {
            type: 'deadline',
            name: `마감 ${this.timeForEndDate(post.startDate)}`,
          },
        ];
      }
      return post;
    });
    return postArr;
  }

  // 메인 화면에서 글 리스트를 조회한다.
  async findPostPagination(
    page: string | null,
    sort: string | null,
    language: string | null,
    period: number | null,
    isClosed: string | null,
    type: string | null,
    position: string | null,
    search: string | null,
    userId: Types.ObjectId | null,
    onOffLine: string | null,
  ) {
    let result: IPostDocument[] = await this.postModel.findPostPagination(
      page,
      sort,
      language,
      period,
      isClosed,
      type,
      position,
      search,
      onOffLine,
    );
    result = this.addPostVirtualField(result, userId);
    return { posts: result };
  }

  // mongoose virtual field 추가
  // mongodb text search를 위해 aggregate 사용 시 virtual field가 조회되지 않음 > 수동 추가
  // isLiked : 사용자의 관심 등록 여부
  // state : 상태 뱃지
  // totalComments : 댓글 수
  addPostVirtualField(posts: IPostDocument[], userId: Types.ObjectId | null): IPostDocument[] {
    let result = [];
    // 글 상태
    const today: Date = new Date();
    const daysAgo: Date = new Date();
    const millisecondDay: number = 1000 * 60 * 60 * 24;
    daysAgo.setDate(today.getDate() - 1); // 24시간 이내
    result = posts.map((post: any) => {
      let isLiked = false;

      // add isLiked
      if (userId != null && post.likes && post.likes.length > 0) {
        // ObjectId 특성 상 IndexOf를 사용할 수 없어 loop로 비교(리팩토링 필요)
        for (const likeUserId of post.likes) {
          if (likeUserId.toString() == userId.toString()) {
            isLiked = true;
            break;
          }
        }
      }
      post.isLiked = isLiked;

      // set Author info
      if (post.author.length > 0) post.author = post.author[post.author.length - 1];

      // add totalComments
      post.totalComments = post.comments.length;

      // add state
      // 1. 3일 이내에 등록된 글이면 최신 글
      // 2. 3일 이내 글이면 마감 임박
      // 3. 일 조회수가 60 이상이면 인기
      if (post.createdAt > daysAgo) post.state = 'new';
      else if (post.startDate > today && (post.startDate.getTime() - today.getTime()) / millisecondDay <= 3)
        post.state = 'deadline';
      else if (Math.abs(post.views / Math.ceil((today.getTime() - post.createdAt.getTime()) / millisecondDay)) >= 60)
        post.state = 'hot';
      else post.state = '';
      return post;
    });

    return result;
  }

  // Pagination을 위해 마지막 페이지를 구한다.
  async findLastPage(
    language: string | null,
    period: number | null,
    isClosed: string | null,
    type: string | null,
    position: string | null,
    search: string | null,
    onOffLine: string | null,
  ) {
    const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
    const totalCount = await this.postModel.countPost(language, period, isClosed, type, position, search, onOffLine);
    const lastPage = Math.ceil(totalCount / itemsPerPage);
    return lastPage;
  }

  // 인기글 조회
  async findPopularPosts(postId: Types.ObjectId, userId: Types.ObjectId) {
    const posts = await this.postModel.findPopularPosts(postId, userId);
    return posts;
  }

  // 메인 화면에서 글를 추천한다.(현재 미사용, 제거예정)
  async recommendToUserFromMain(userId: Types.ObjectId) {
    let sort;
    let likeLanguages = null;
    const limit = 20;
    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user !== null && user.likeLanguages) likeLanguages = user.likeLanguages;
      sort = 'views';
    } else {
      sort = 'totalLikes';
    }

    const posts = await this.postModel.findPostRecommend('-views', likeLanguages, null, null, limit);
    return posts;
  }

  // 글에서 글를 추천한다.
  async recommendToUserFromPost(postId: Types.ObjectId, userId: Types.ObjectId) {
    const sort = '-views';
    let language = null;
    const limit = 10;
    if (postId) {
      const post = await this.postModel.findById(postId);
      if (post === null) throw new CustomError('JsonWebTokenError', 404, 'Post not found');

      language = post.language;
    }

    const posts = await this.postModel.findPostRecommend(sort, language, postId, userId, limit);
    return posts;
  }

  // 조회수 증가
  async increaseView(postId: Types.ObjectId, userId: Types.ObjectId) {
    // 읽은 목록 중복 삽입 방지
    if (userId) {
      await Promise.all([await ReadPosts.insertIfNotExist(postId, userId), await this.postModel.increaseView(postId)]);
    } else {
      await this.postModel.increaseView(postId); // 조회수 증가
    }
  }

  // 상세 글 정보를 조회한다.
  // 로그인된 사용자일 경우 읽은 목록을 추가한다.
  async findPostDetail(postId: Types.ObjectId, userId: Types.ObjectId) {
    const posts = await this.postModel.findById(postId).populate('author', 'nickName image');
    if (!posts) throw new CustomError('NotFoundError', 404, 'Post not found');
    const postToObject = posts.toObject({ virtuals: true });
    const today: Date = new Date();
    const badge = [];
    if (postToObject.startDate > today) {
      badge.push({
        type: 'deadline',
        name: `마감 ${this.timeForEndDate(postToObject.startDate)}`,
      });
    }
    postToObject.badge = badge;

    await this.increaseView(postId, userId); // 조회수 증가
    return postToObject;
  }

  timeForEndDate(endDate: Date): string {
    const today: Date = new Date();
    const betweenTime: number = Math.floor((endDate.getTime() - today.getTime()) / 1000 / 60);

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay > 1 && betweenTimeDay < 365) {
      return `${betweenTimeDay}일전`;
    }
    const betweenTimeHour = Math.floor(betweenTime / 60);
    return `${betweenTimeHour}시간전`;
  }

  // 사용자의 관심 등록 여부를 조회한다.
  async findUserLiked(postId: Types.ObjectId, userId: Types.ObjectId) {
    if (userId && postId) {
      const posts = await this.postModel.find({ _id: postId, likes: userId });
      const isLiked = posts.length > 0;
      return isLiked;
    }
    return false;
  }

  // 글의 관심 등록한 사용자 리스트를 조회한다.
  async findLikeUsers(postId: Types.ObjectId) {
    const likeUsers = await this.postModel.findById(postId).select('likes');
    if (!likeUsers) return [];
    return likeUsers.likes;
  }

  // 신규 글를 등록한다.
  async registerPost(userID: Types.ObjectId, post: IPostDocument) {
    post.author = userID;
    if (post.content) {
      const cleanHTML = sanitizeHtml(post.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });
      post.content = cleanHTML;
    }
    const postRecord = await this.postModel.create(post);
    return postRecord;
  }

  // 글 정보를 수정한다.
  async modifyPost(id: Types.ObjectId, tokenUserId: Types.ObjectId, tokenType: string, post: IPost) {
    await this.postModel.checkPostAuthorization(id, tokenUserId, tokenType); // 접근 권한 체크
    if (post.content) {
      const cleanHTML = sanitizeHtml(post.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });
      post.content = cleanHTML;
    }
    const postRecord = await this.postModel.modifyPost(id, post);
    return postRecord;
  }

  // 글를 삭제한다.
  async deletePost(id: Types.ObjectId, tokenUserId: Types.ObjectId, tokenType: string) {
    await this.postModel.checkPostAuthorization(id, tokenUserId, tokenType); // 접근 권한 체크
    await this.postModel.deletePost(id);
    await this.notificationModel.deleteNotificationByPost(id); // 글 삭제 시 관련 알림 제거
  }

  // 관심 등록 추가
  async addLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { post, isLikeExist } = await this.postModel.addLike(postId, userId);
    if (!isLikeExist) {
      await LikePosts.add(postId, userId);
      // await this.notificationModel.registerNotification(postId, post.author, userId, 'like');   // 알림 등록
    }
    return post;
  }

  // 관심 등록 취소(삭제)
  async deleteLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { post, isLikeExist } = await this.postModel.deleteLike(postId, userId);
    if (isLikeExist) {
      await LikePosts.delete(postId, userId);
      // await this.notificationModel.deleteNotification(postId, post.author, userId, 'like');   // 알림 삭제
    }
    return post;
  }

  // 자동 마감
  async autoClosing() {
    await this.postModel.autoClosing();
  }
}
