import sanitizeHtml from 'sanitize-html';
import { Types } from 'mongoose';
import { IPost, IPostModel, IPostDocument } from '../models/Post';
import { INotificationModel } from '../models/Notification';
import { IUserModel } from '../models/User';
import CustomError from '../CustomError';

export class PostService {
  constructor(
    protected postModel: IPostModel,
    protected userModel: IUserModel,
    protected notificationModel: INotificationModel,
  ) {}

  // 리팩토링필요
  // 메인 화면에서 스터디 리스트를 조회한다.
  async findPost(
    offset: number | null,
    limit: number | null,
    sort: string | null,
    language: string | null,
    period: number | null,
    isClosed: string | null,
  ) {
    const posts = await this.postModel.findPost(offset, limit, sort, language, period, isClosed);
    const sortPosts = this.sortLanguageByQueryParam(posts, language);
    return sortPosts;
  }

  // 선택한 언어가 리스트의 앞에 오도록 정렬
  async sortLanguageByQueryParam(posts: IPostDocument[], language: string | null) {
    if (typeof language !== 'string') return posts;

    const paramLanguage = language.split(',');
    for (let i = 0; i < posts.length; i += 1) {
      posts[i].language.sort(function (a, b) {
        if (paramLanguage.indexOf(b) !== -1) return 1;
        return -1;
      });
    }
    return posts;
  }

  // 메인 화면에서 스터디를 추천한다.
  // 4건 이하일 경우 무조건 다시 조회가 아니라, 해당 되는 건은 포함하고 나머지 건만 조회해야한다.
  async recommendToUserFromMain(userId: Types.ObjectId) {
    let sort;
    let likeLanguages = null;
    const limit = 20;
    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user !== null) likeLanguages = user.likeLanguages;
      sort = 'views';
    } else {
      sort = 'totalLikes';
    }

    const posts = await this.postModel.findPostRecommend('-views', likeLanguages, null, null, limit);
    return posts;
  }

  // 글에서 스터디를 추천한다.
  // 4건 이하일 경우 무조건 다시 조회가 아니라, 해당 되는 건은 포함하고 나머지 건만 조회해야함
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
  async increaseView(postId: Types.ObjectId, userId: Types.ObjectId, readList: string) {
    let isAlreadyRead = true;
    let updateReadList = readList;

    // 조회수 중복 증가 방지
    if (readList === undefined || (typeof readList === 'string' && readList.indexOf(postId.toString()) === -1)) {
      await this.postModel.increaseView(postId); // 조회수 증가
      if (userId) await this.userModel.addReadList(postId, userId); // 읽은 목록 추가
      if (readList === undefined) updateReadList = `${postId}`;
      else updateReadList = `${readList}|${postId}`;
      isAlreadyRead = false;
    }
    return { updateReadList, isAlreadyRead };
  }

  // 상세 스터디 정보를 조회한다.
  // 로그인된 사용자일 경우 읽은 목록을 추가한다.
  async findPostDetail(postId: Types.ObjectId, userId: Types.ObjectId) {
    const posts = await this.postModel
      .findById(postId)
      .populate('author', 'nickName image')
      .populate('comments.author', 'nickName image');
    return posts;
  }

  // 알림을 읽음 표시하고 상세 스터디 정보를 조회한다.
  async findPostDetailAndUpdateReadAt(postId: Types.ObjectId, userId: Types.ObjectId) {
    if (userId) {
      await this.notificationModel.updateReadAt(postId, userId);
    }
    const result = await this.findPostDetail(postId, userId);
    return result;
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

  // 스터디의 관심 등록한 사용자 리스트를 조회한다.
  async findLikeUsers(postId: Types.ObjectId) {
    const likeUsers = await this.postModel.findById(postId).select('likes');
    if (!likeUsers) return [];
    return likeUsers.likes;
  }

  // 신규 스터디를 등록한다.
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

  // 스터디 정보를 수정한다.
  async modifyPost(id: Types.ObjectId, tokenUserId: Types.ObjectId, post: IPost) {
    await this.postModel.checkPostAuthorization(id, tokenUserId); // 접근 권한 체크
    if (post.content) {
      const cleanHTML = sanitizeHtml(post.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });
      post.content = cleanHTML;
    }
    const postRecord = await this.postModel.modifyPost(id, post);
    return postRecord;
  }

  // 스터디를 삭제한다.
  async deletePost(id: Types.ObjectId, tokenUserId: Types.ObjectId) {
    await this.postModel.checkPostAuthorization(id, tokenUserId); // 접근 권한 체크
    await this.postModel.deletePost(id);
    await this.notificationModel.deleteNotificationByPost(id); // 글 삭제 시 관련 알림 제거
  }

  // 관심 등록 추가
  async addLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { post, isLikeExist } = await this.postModel.addLike(postId, userId);
    if (!isLikeExist) {
      await this.userModel.addLikePost(postId, userId);
      // await this.notificationModel.registerNotification(postId, post.author, userId, 'like');   // 알림 등록
    }
    return post;
  }

  // 관심 등록 취소(삭제)
  async deleteLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { post, isLikeExist } = await this.postModel.deleteLike(postId, userId);
    if (isLikeExist) {
      await this.userModel.deleteLikePost(postId, userId);
      // await this.notificationModel.deleteNotification(postId, post.author, userId, 'like');   // 알림 삭제
    }
    return post;
  }
}
