import { Model, Schema, model, Types, Document } from 'mongoose';
import CustomError from '../CustomError';

// 대댓글
export interface IReply {
  contnet: string;
  author: Types.ObjectId;
}

export interface IReplyDocument extends IReply, Document {}

export type IReplyModel = Model<IReplyDocument>;

// 댓글
export interface IComment {
  content: string;
  author: Types.ObjectId;
  replies: IReplyDocument[];
}

export interface ICommentDocument extends IComment, Document {}

export type ICommentModel = Model<ICommentDocument>;

// 글
export interface IPost {
  author: Types.ObjectId; // 글 등록자 정보
  topic: string; // 글 주제(사용 X)
  language: string[]; // 사용 언어 리스트
  location: string; // 스터디 장소(사용 X)
  title: string; // 글 제목
  content: string; // 글 내용
  isDeleted: boolean; // 글 삭제 여부
  isClosed: boolean; // 글 마감 여부
  views: number; // 글 조회수
  comments: ICommentDocument[]; // 글 댓글 정보
  likes: Types.ObjectId[]; // 관심 등록한 사용자 리스트
  totalLikes: number; // 관심 등록 수
}

export interface IPostDocument extends IPost, Document {}

export interface IPostModel extends Model<IPostDocument> {
  findPost: (
    offset: number | null,
    limit: number | null,
    sort: string | null,
    language: string | null,
    period: number | null,
    isClosed: string | null,
  ) => Promise<IPostDocument[]>;
  findPostRecommend: (
    sort: string | null,
    language: string[] | null,
    postId: Types.ObjectId | null,
    userId: Types.ObjectId | null,
    limit: number | null,
  ) => Promise<IPostDocument[]>;
  registerComment: (
    postId: Types.ObjectId,
    content: string,
    author: Types.ObjectId,
  ) => Promise<{ post: IPostDocument; commentId: Types.ObjectId }>;
  registerReply: (
    postId: Types.ObjectId,
    commentId: Types.ObjectId,
    content: string,
    author: Types.ObjectId,
  ) => Promise<{ post: IPostDocument; replyId: Types.ObjectId }>;
  findComments: (id: Types.ObjectId) => Promise<IPostDocument>;
  deletePost: (id: Types.ObjectId) => void;
  modifyPost: (id: Types.ObjectId, post: IPost) => Promise<IPostDocument>;
  modifyComment: (comment: IComment) => Promise<IPostDocument>;
  modifyReply: (comment: IReply) => Promise<IPostDocument>;
  deleteComment: (id: Types.ObjectId) => Promise<IPostDocument>;
  deleteReply: (id: Types.ObjectId) => Promise<IPostDocument>;
  addLike: (postId: Types.ObjectId, userId: Types.ObjectId) => Promise<{ post: IPostDocument; isLikeExist: boolean }>;
  deleteLike: (
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ) => Promise<{ post: IPostDocument; isLikeExist: boolean }>;
  increaseView: (postId: Types.ObjectId) => void;
  findAuthorByCommentId: (commentId: Types.ObjectId) => Promise<Types.ObjectId | null>;
  findAuthorByReplyId: (replyId: Types.ObjectId) => Promise<Types.ObjectId | null>;
  checkPostAuthorization: (postId: Types.ObjectId, tokenUserId: Types.ObjectId) => void;
  checkCommentAuthorization: (commentId: Types.ObjectId, tokenUserId: Types.ObjectId) => void;
  checkReplyAuthorization: (replyId: Types.ObjectId, tokenUserId: Types.ObjectId) => void;
}

// 대댓글 스키마
const replySchema = new Schema<IReplyDocument>(
  {
    content: String, // 댓글 내용
    author: { type: Types.ObjectId, ref: 'User' }, // 댓글 등록자 정보
  },
  {
    versionKey: false,
    timestamps: true, // createdAt, updatedAt 컬럼 사용
  },
);

// 댓글 스키마
const commentSchema = new Schema<ICommentDocument>(
  {
    content: String, // 댓글 내용
    author: { type: Types.ObjectId, ref: 'User' }, // 댓글 등록자 정보
    replies: [replySchema],
  },
  {
    versionKey: false,
    timestamps: true, // createdAt, updatedAt 컬럼 사용
  },
);

const postSchema = new Schema<IPostDocument>(
  {
    author: { type: Types.ObjectId, ref: 'User' }, // 글 등록자 정보
    topic: String, // 글 주제(사용 X)
    language: [String], // 사용 언어 리스트
    location: String, // 스터디 장소(사용 X)
    title: String, // 글 제목
    content: String, // 글 내용
    isDeleted: { type: Boolean, default: false }, // 글 삭제 여부
    isClosed: { type: Boolean, default: false }, // 글 마감 여부
    views: { type: Number, default: 0 }, // 글 조회수
    comments: [commentSchema], // 글 댓글 정보
    likes: [{ type: Types.ObjectId, ref: 'User' }], // 관심 등록한 사용자 리스트
    totalLikes: { type: Number, default: 0 }, // 관심 등록 수
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

postSchema.virtual('totalComments').get(function (this: IPost) {
  return this.comments.length;
});

// schema.static('myStaticMethod', function myStaticMethod() {
//   return 42;
// });
// 최신, 트레딩 조회
postSchema.statics.findPost = async function (offset, limit, sort, language, period, isClosed) {
  // Pagenation
  const offsetQuery = parseInt(offset, 10) || 0;
  const limitQuery = parseInt(limit, 10) || 20;

  let sortQuery = [];
  // Sorting
  if (sort) {
    const sortableColumns = ['views', 'createdAt', 'totalLikes'];
    sortQuery = sort.split(',').filter((value: string) => {
      return sortableColumns.indexOf(value.substr(1, value.length)) !== -1 || sortableColumns.indexOf(value) !== -1;
    });
    sortQuery.push('-createdAt');
  } else {
    sortQuery.push('createdAt');
  }
  // Query
  const query: any = {};
  if (typeof language === 'string') query.language = { $in: language.split(',') };
  else if (typeof language === 'undefined') return [];

  if (typeof period === 'number' && !Number.isNaN(period)) {
    const today = new Date();
    query.createdAt = { $gte: today.setDate(today.getDate() - period) };
  }

  // 마감된 글 안보기 기능(false만 지원)
  if (typeof isClosed === 'string' && !(isClosed === 'true')) {
    query.isClosed = { $eq: isClosed === 'true' };
  }
  const result = await this.find(query)
    .where('isDeleted')
    .equals(false)
    .sort(sortQuery.join(' '))
    .skip(Number(offsetQuery))
    .limit(Number(limitQuery));
  return result;
};
// 사용자에게 추천 조회
postSchema.statics.findPostRecommend = async function (sort, language, postId, userId, limit) {
  let sortQuery = [];
  // Sorting
  if (sort) {
    const sortableColumns = ['views', 'createdAt', 'totalLikes'];
    sortQuery = sort.split(',').filter((value: string) => {
      return sortableColumns.indexOf(value.substr(1, value.length)) !== -1 || sortableColumns.indexOf(value) !== -1;
    });
  } else {
    sortQuery.push('createdAt');
  }
  // Query
  const query: any = {};
  if (typeof language === 'object' && language.length > 0) query.language = { $in: language };

  // 14일 이내 조회
  const today = new Date();
  query.createdAt = { $gte: today.setDate(today.getDate() - 14) };

  // 현재 읽고 있는 글은 제외하고 조회
  query._id = { $ne: postId };

  // 사용자가 작성한 글 제외하고 조회
  if (userId) query.author = { $ne: userId };

  const posts = await this.find(query)
    .where('isDeleted')
    .equals(false)
    .where('isClosed')
    .equals(false)
    .sort(sortQuery.join(' '))
    .limit(limit)
    .select('-isDeleted');

  // 부족한 개수만큼 추가 조회
  if (posts.length < limit - 1) {
    const notInPostIdArr = posts.map((post: IPostDocument) => {
      return post._id;
    });
    notInPostIdArr.push(postId);
    query._id = { $nin: notInPostIdArr }; // 이미 조회된 글들은 중복 x
    delete query.language;
    const shortPosts = await this.find(query)
      .where('isDeleted')
      .equals(false)
      .where('isClosed')
      .equals(false)
      .sort(sortQuery.join(' '))
      .limit(limit - posts.length)
      .select('-isDeleted');
    posts.push(...shortPosts);
  }
  return posts;
};

postSchema.statics.registerComment = async function (postId, content, author) {
  const commentId = new Types.ObjectId();
  const post = await this.findOneAndUpdate(
    { _id: postId },
    { $push: { comments: { _id: commentId, content, author } } },
    { new: true, upsert: true },
  );
  return { post, commentId };
};

postSchema.statics.registerReply = async function (postId, commentId, content, author) {
  const replyId = new Types.ObjectId();
  const post = await this.findOneAndUpdate(
    { _id: postId, comments: { $elemMatch: { _id: commentId } } },
    { $push: { 'comments.$.replies': { _id: replyId, content, author } } },
    { new: true, upsert: true },
  );
  return { post, replyId };
};

postSchema.statics.findComments = async function (id) {
  const result = await this.findById(id)
    .populate('comments.author', 'nickName image')
    .populate('comments.replies.author', 'nickName image');
  return result;
};

postSchema.statics.deletePost = async function (id) {
  await this.findOneAndUpdate({ _id: id }, { isDeleted: true });
};

postSchema.statics.modifyPost = async function (id, post) {
  const postRecord = await this.findByIdAndUpdate({ _id: id }, post, {
    new: true,
  });
  return postRecord;
};

// 댓글 수정
postSchema.statics.modifyComment = async function (comment) {
  const { _id, content } = comment;
  const commentRecord = await this.findOneAndUpdate(
    { comments: { $elemMatch: { _id } } },
    { $set: { 'comments.$.content': content } },
    { new: true },
  );
  return commentRecord;
};

// 대댓글 수정
postSchema.statics.modifyReply = async function (comment) {
  const { _id, content, commentId } = comment;
  const commentRecord = await this.findOneAndUpdate(
    {
      comments: { $elemMatch: { _id: commentId } },
    },
    {
      $set: { 'comments.$[].replies.$[i].content': content },
    },
    {
      arrayFilters: [{ 'i._id': _id }],
      new: true,
    },
  );
  return commentRecord;
};

postSchema.statics.deleteComment = async function (id) {
  const commentRecord = await this.findOneAndUpdate(
    { comments: { $elemMatch: { _id: id } } },
    { $pull: { comments: { _id: id } } },
  );
  return commentRecord;
};

postSchema.statics.deleteReply = async function (id) {
  const commentRecord = await this.findOneAndUpdate(
    { 'comments.replies': { $elemMatch: { _id: id } } },
    { $pull: { 'comments.$.replies': { _id: id } } },
  );
  return commentRecord;
};

// 관심등록 추가
// 디바운스 실패 경우를 위해 예외처리
postSchema.statics.addLike = async function (postId, userId) {
  const post: IPost[] = await this.find({ _id: postId, likes: { $in: [userId] } });
  const isLikeExist = post.length > 0;
  let result: IPost;

  if (!isLikeExist) {
    result = await this.findByIdAndUpdate(
      { _id: postId },
      {
        $push: {
          likes: {
            _id: userId,
          },
        },
        $inc: {
          totalLikes: 1,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  } else {
    result = post[post.length - 1];
  }
  return { post: result, isLikeExist };
};

postSchema.statics.deleteLike = async function (postId, userId) {
  const posts = await this.find({ _id: postId });
  let post: IPost | null = posts[posts.length - 1];

  const isLikeExist = post && post.likes.indexOf(userId) > 0;
  if (isLikeExist) {
    post = await this.findOneAndUpdate(
      { _id: postId },
      {
        $pull: { likes: userId },
        $inc: {
          totalLikes: -1,
        },
      },
      {
        new: true,
      },
    );
  }
  return { post, isLikeExist };
};

// 조회수 증가
postSchema.statics.increaseView = async function (postId) {
  await this.findOneAndUpdate(
    { _id: postId },
    {
      $inc: {
        views: 1,
      },
    },
  );
};

// 댓글 등록한 사용자 아이디 조회
postSchema.statics.findAuthorByCommentId = async function (commentId) {
  const post = await this.findOne({ comments: { $elemMatch: { _id: commentId } } });
  if (post) {
    const { author } = post.comments[post.comments.length - 1];
    return author;
  }
  return null;
};

// 대댓글 등록한 사용자 아이디 조회
postSchema.statics.findAuthorByReplyId = async function (replyId) {
  const post = await this.findOne({ 'comments.replies': { $elemMatch: { _id: replyId } } });
  if (post) {
    const { author } = post.comments[post.comments.length - 1];
    return author;
  }
  return null;
};

// 스터디 수정 권한 체크
postSchema.statics.checkPostAuthorization = async function (postId, tokenUserId) {
  const post = await this.findOne({ _id: postId, author: tokenUserId });
  if (!post) {
    throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
  }
};

// 댓글 수정 권한 체크
postSchema.statics.checkCommentAuthorization = async function (commentId, tokenUserId) {
  const post = await this.findOne({ comments: { $elemMatch: { _id: commentId, author: tokenUserId } } });
  if (!post) {
    throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
  }
};

// 대댓글 수정 권한 체크
postSchema.statics.checkReplyAuthorization = async function (replyId, tokenUserId) {
  const post = await this.findOne({ 'comments.replies': { $elemMatch: { _id: replyId, author: tokenUserId } } });
  if (!post) {
    throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
  }
};

const Post = model<IPostDocument, IPostModel>('Post', postSchema);

export { Post };
