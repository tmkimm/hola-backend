import { Model, Schema, model, Types, Document, QueryCursor } from 'mongoose';
import CustomError from '../CustomError';
import { isNumber } from '../utills/isNumber';
// eslint-disable-next-line import/no-unresolved
import { studyOrProjectCode, onlineOrOfflineCode, recruitsCode, expectedPeriodCode } from '../CommonCode';
// 대댓글
export interface IReply {
  contnet: string;
  author: Types.ObjectId;
}
/**
 * @swagger
 *  components:
 *  schemas:
 *   Post:
 *     properties:
 *      _id:
 *        type: string
 *        description: 글 ID
 *        example: '6355eee637ad670014118738'
 *      author:
 *        type: string
 *        description: 글 등록자 정보
 *        example: '634e1a1537ad67001410d1f4'
 *      language:
 *        type: array
 *        items:
 *          type: string
 *        description: 사용 언어
 *        example:
 *          - react
 *          - java
 *      title:
 *        type: string
 *        description: 제목
 *      content:
 *        type: string
 *        description: 내용
 *      isDeleted:
 *        type: boolean
 *        description: 삭제 여부
 *      isClosed:
 *        type: boolean
 *        description: 마감 여부
 *      views:
 *        type: number
 *        description: 조회수
 *        example: 219
 *      likes:
 *        type: array
 *        description: 관심 등록한 사용자 리스트
 *        items:
 *          type: string
 *        example:
 *          - '634e1a1537ad67001410d1f4'
 *          - '61063a70ed4b420bbcfa0b4b'
 *      totalLikes:
 *        type: number
 *        description: 관심 등록 수
 *        example: 2
 *      type:
 *        type: string
 *        description: '모집 구분(1 : 프로젝트, 2: 스터디)'
 *        example: '1'
 *      recruits:
 *        type: string
 *        description: '모집인원(und: 인원 미정, 1, 2, 3, mo: 10명 이상)'
 *        example: 'und'
 *      onlineOrOffline:
 *        type: string
 *        description: '진행방식(on: 온라인/ off: 오프라인)'
 *        example: 'on'
 *      contactType:
 *        type: string
 *        description: '연락방법(ok: 오픈 카카오톡, em: 이메일, pk: 개인 카카오톡, gf: 구글폼)'
 *        example: 'em'
 *      contactPoint:
 *        type: string
 *        description: '연락링크'
 *        example: 'https://open.kakao.com/o/sKdsLWGe'
 *      expectedPeriod:
 *        type: string
 *        description: '예상 진행기간(und: 기간 미정, 1, 2, 3, mo: 장기)'
 *        example: '3'
 *      positions:
 *        type: array
 *        description: '포지션(FE: 프론트엔드, BE: 백엔드, DE: 디자이너, IOS: IOS, AND: 안드로이드, DEVOPS: DevOps, PM)'
 *        items:
 *          type: string
 *        example:
 *          - 'FE'
 *          - 'BE'
 *      state:
 *        type: string
 *        description: '글 상태(new : 신규글, deadline : 마감임박, hot:인기)'
 *        items:
 *          type: string
 *        example:
 *          - '1'
 *          - 'new'
 *      createdAt:
 *        type: string
 *        description: 생성일
 *        format: date-time
 *        example: "2021-01-30T08:30:00Z"
 *      startDate:
 *        type: string
 *        description: 시작예정일
 *        format: date-time
 *        example: "2021-01-30T08:30:00Z"
 *      endDate:
 *        type: string
 *        description: 모집 마감일
 *        format: date-time
 *        example: "2021-01-30T08:30:00Z"
 *      closeDate:
 *        type: string
 *        description: 마감처리일
 *        format: date-time
 *        example: "2021-01-30T08:30:00Z"
 *      deleteDate:
 *        type: string
 *        description: 삭제일
 *        format: date-time
 *        example: "2021-01-30T08:30:00Z"
 *      comments:
 *        type: array
 *        items:
 *          $ref: '#/components/schemas/Comment'
 *   Comment:
 *     properties:
 *      _id:
 *        type: string
 *        description: 댓글 ID
 *        example: '6355eee637ad670014118738'
 *      author:
 *        type: string
 *        description: 작성자 ID
 *        example: '63574b3b37ad67001411ba50'
 *      content:
 *        type: string
 *        description: 댓글 내용
 *        example: '신청합니다!'
 */

/**
 * @swagger
 *  components:
 *  schemas:
 *   PostMain:
 *     properties:
 *      _id:
 *        type: string
 *        description: 글 ID
 *        example: '6355eee637ad670014118738'
 *      author:
 *        type: string
 *        description: 글 등록자 정보
 *        example: '634e1a1537ad67001410d1f4'
 *      language:
 *        type: array
 *        items:
 *          type: string
 *        description: 사용 언어
 *        example:
 *          - react
 *          - java
 *      title:
 *        type: string
 *        description: 제목
 *      isClosed:
 *        type: boolean
 *        description: 마감 여부
 *      views:
 *        type: number
 *        description: 조회수
 *        example: 219
 *      likes:
 *        type: array
 *        description: 관심 등록한 사용자 리스트
 *        items:
 *          type: string
 *        example:
 *          - '634e1a1537ad67001410d1f4'
 *          - '61063a70ed4b420bbcfa0b4b'
 *      totalLikes:
 *        type: number
 *        description: 관심 등록 수
 *        example: 2
 *      isLiked:
 *        type: boolean
 *        description: 사용자의 관심 등록 여부
 *        example: false
 *      type:
 *        type: string
 *        description: '모집 구분(1 : 프로젝트, 2: 스터디)'
 *        example: '1'
 *      recruits:
 *        type: string
 *        description: '모집인원(und: 인원 미정, 1, 2, 3, mo: 10명 이상)'
 *        example: 'und'
 *      onlineOrOffline:
 *        type: string
 *        description: '진행방식(on: 온라인/ off: 오프라인)'
 *        example: 'on'
 *      contactType:
 *        type: string
 *        description: '연락방법(ok: 오픈 카카오톡, em: 이메일, pk: 개인 카카오톡, gf: 구글폼)'
 *        example: 'em'
 *      expectedPeriod:
 *        type: string
 *        description: '예상 진행기간(und: 기간 미정, 1, 2, 3, mo: 장기)'
 *        example: '3'
 *      positions:
 *        type: array
 *        description: '포지션(FE: 프론트엔드, BE: 백엔드, DE: 디자이너, IOS: IOS, AND: 안드로이드, DEVOPS: DevOps, PM)'
 *        items:
 *          type: string
 *        example:
 *          - 'FE'
 *          - 'BE'
 *      state:
 *        type: string
 *        description: '글 상태(new : 신규글, deadline : 마감임박, hot:인기)'
 *        items:
 *          type: string
 *        example:
 *          - '1'
 *          - 'new'
 *      createdAt:
 *        type: string
 *        description: 생성일
 *        format: date-time
 *        example: "2021-01-30T08:30:00Z"
 *      startDate:
 *        type: string
 *        description: 시작예정일
 *        format: date-time
 *        example: "2021-01-30T08:30:00Z"
 *      endDate:
 *        type: string
 *        description: 모집 마감일
 *        format: date-time
 *        example: "2021-01-30T08:30:00Z"
 *      closeDate:
 *        type: string
 *        description: 마감처리일
 *        format: date-time
 *        example: "2021-01-30T08:30:00Z"
 */
export interface IReplyDocument extends IReply, Document {}

export type IReplyModel = Model<IReplyDocument>;

// 댓글
export interface IComment {
  content: string;
  author: Types.ObjectId;
  replies: IReplyDocument[] | undefined;
}

export interface ICommentDocument extends IComment, Document {}

export type ICommentModel = Model<ICommentDocument>;

// 글
export interface IPost {
  author: Types.ObjectId; // 글 등록자 정보
  language: string[]; // 사용 언어 리스트
  title: string; // 글 제목
  content: string; // 글 내용
  isDeleted: boolean; // 글 삭제 여부
  isClosed: boolean; // 글 마감 여부
  isLiked: boolean; // 관심 등록 여부
  views: number; // 글 조회수
  comments: ICommentDocument[]; // 글 댓글 정보
  likes: Types.ObjectId[]; // 관심 등록한 사용자 리스트
  totalLikes: number; // 관심 등록 수
  type: string; // 모집 구분(스터디/프로젝트)
  recruits: string; // 모집인원
  onlineOrOffline: string; // 진행방식(온라인/오프라인)
  contactType: string; // 연락방법(오픈 카카오톡, 이메일, 개인 카카오톡)
  contactPoint: string; // 연락 링크
  udemyLecture: string; // udemy 강의
  expectedPeriod: string; // 예상 종료일
  positions: string[]; // 포지션
  createdAt: Date; // 등록일
  startDate: Date; // 시작예정일
  closeDate: Date; // 마감일
  deleteDate: Date; // 삭제일
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
    type: string | null,
    position: string | null,
    search: string | null,
  ) => Promise<IPostDocument[]>;
  findPostPagination: (
    page: string | null,
    sort: string | null,
    language: string | null,
    period: number | null,
    isClosed: string | null,
    type: string | null,
    position: string | null,
    search: string | null,
  ) => Promise<IPostDocument[]>;
  countPost: (
    language: string | null,
    period: number | null,
    isClosed: string | null,
    type: string | null,
    position: string | null,
    search: string | null,
  ) => Promise<number>;
  findPopularPosts: (postId: Types.ObjectId | null, userId: Types.ObjectId | null) => Promise<IPostDocument[]>;
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
  checkPostAuthorization: (postId: Types.ObjectId, tokenUserId: Types.ObjectId, tokenType: string) => void;
  checkCommentAuthorization: (commentId: Types.ObjectId, tokenUserId: Types.ObjectId, tokenType: string) => void;
  checkReplyAuthorization: (replyId: Types.ObjectId, tokenUserId: Types.ObjectId) => void;
  autoClosing: () => void;
}

// 대댓글 스키마
const replySchema = new Schema<IReplyDocument>(
  {
    content: String, // 댓글 내용
    author: { type: Types.ObjectId, ref: 'User', required: true }, // 댓글 등록자 정보
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
    author: { type: Types.ObjectId, ref: 'User', required: true }, // 댓글 등록자 정보
    replies: [replySchema],
  },
  {
    versionKey: false,
    timestamps: true, // createdAt, updatedAt 컬럼 사용
  },
);

const postSchema = new Schema<IPostDocument>(
  {
    author: { type: Types.ObjectId, ref: 'User', required: true }, // 글 등록자 정보
    language: { type: [String], validate: (v: any) => Array.isArray(v) && v.length > 0 }, // 사용 언어 리스트
    title: { type: String, required: true }, // 글 제목
    content: { type: String, required: true }, // 글 내용
    isDeleted: { type: Boolean, default: false }, // 글 삭제 여부
    isClosed: { type: Boolean, default: false }, // 글 마감 여부
    views: { type: Number, default: 0 }, // 글 조회수
    comments: [commentSchema], // 글 댓글 정보
    likes: [{ type: Types.ObjectId, ref: 'User' }], // 관심 등록한 사용자 리스트
    totalLikes: { type: Number, default: 0 }, // 관심 등록 수
    startDate: { type: Date, default: null }, // 시작예정일
    endDate: { type: Date, default: null }, //  진행 종료일
    type: { type: String, default: null }, // 모집 구분(스터디/프로젝트)
    recruits: { type: String, default: null }, // 모집인원
    onlineOrOffline: { type: String, default: null }, // 진행방식(온라인/오프라인)
    contactType: { type: String, default: null }, // 연락방법(오픈 카카오톡, 이메일, 개인 카카오톡)
    contactPoint: { type: String, default: null }, // 연락 링크
    udemyLecture: { type: String, default: null }, // udemy 강의
    expectedPeriod: { type: String, default: null }, // 예상 종료일
    positions: { type: [String] },
    closeDate: { type: Date, default: null }, //  마감일
    deleteDate: { type: Date, default: null }, //  삭제일
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

// 글 상태(뱃지)
postSchema.virtual('state').get(function (this: IPost) {
  let state = '';

  // 글 상태
  const today: Date = new Date();
  const daysAgo: Date = new Date();
  const millisecondDay: number = 1000 * 60 * 60 * 24;
  daysAgo.setDate(today.getDate() - 1); // 24시간 이내
  // 1. 3일 이내에 등록된 글이면 최신 글
  // 2. 3일 이내 글이면 마감 임박
  // 3. 일 조회수가 60 이상이면 인기
  if (this.createdAt > daysAgo) state = 'new';
  else if (this.startDate > today && (this.startDate.getTime() - today.getTime()) / millisecondDay <= 3)
    state = 'deadline';
  else if (Math.abs(this.views / Math.ceil((today.getTime() - this.createdAt.getTime()) / millisecondDay)) >= 60)
    state = 'hot';
  return state;
});

postSchema.virtual('totalComments').get(function (this: IPost) {
  return this.comments.length;
});

// 조회 query 생성
const makeFindPostQuery = (
  language: string | null,
  period: string | null,
  isClosed: string | null,
  type: string | null,
  position: string | null,
  search: string | null,
) => {
  // Query
  const query: any = {};

  if (typeof language === 'string') query.language = { $in: language.split(',') };
  if (typeof position === 'string' && position && position !== 'ALL') query.positions = position;

  if (typeof period === 'number' && !Number.isNaN(period)) {
    const today = new Date();
    query.createdAt = { $gte: today.setDate(today.getDate() - period) };
  }
  // 마감된 글 안보기 기능(false만 지원)
  if (typeof isClosed === 'string' && isClosed === 'false') {
    query.isClosed = { $eq: false };
  }

  query.isDeleted = { $eq: false };
  // 글 구분(0: 전체, 1: 프로젝트, 2: 스터디)
  if (typeof type === 'string') {
    if (type === '0') query.$or = [{ type: '1' }, { type: '2' }];
    else query.type = { $eq: type };
  }

  // 텍스트 검색
  // if (typeof search === 'string') {
  //   query.$text = { $search: search };
  // }
  return query;
};

// 최신, 트레딩 조회
postSchema.statics.findPost = async function (offset, limit, sort, language, period, isClosed, type, position, search) {
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
  // posts_text_search
  // Query
  const query = makeFindPostQuery(language, period, isClosed, type, position, search); // 조회 query 생성

  const aggregateSearch = [];
  if (search && typeof search === 'string') {
    aggregateSearch.push({
      $search: {
        index: 'posts_text_search',
        text: {
          query: search,
          path: {
            wildcard: '*',
          },
        },
      },
    });
  }

  const aggregate = [
    ...aggregateSearch,
    { $match: query },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        pipeline: [{ $project: { _id: 1, nickName: 1, image: 1 } }],
        as: 'author',
      },
    },
    {
      $project: {
        title: 1,
        views: 1,
        comments: 1,
        likes: 1,
        language: 1,
        isClosed: 1,
        totalLikes: 1,
        startDate: 1,
        endDate: 1,
        type: 1,
        onlineOrOffline: 1,
        contactType: 1,
        recruits: 1,
        expectedPeriod: 1,
        author: 1,
        positions: 1,
        createdAt: 1,
      },
    },
  ];
  const result = await this.aggregate(aggregate)
    .sort(sortQuery.join(' '))
    .skip(Number(offsetQuery))
    .limit(Number(limitQuery));
  // .select(
  //   `title views comments likes language isClosed totalLikes startDate endDate type onlineOrOffline contactType recruits expectedPeriod author positions createdAt`,
  // )
  // .populate('author', 'nickName image');
  // const result = await this.find(query)
  //   .sort(sortQuery.join(' '))
  //   .skip(Number(offsetQuery))
  //   .limit(Number(limitQuery))
  //   .select(
  //     `title views comments likes language isClosed totalLikes startDate endDate type onlineOrOffline contactType recruits expectedPeriod author positions createdAt`,
  //   )
  //   .populate('author', 'nickName image');
  return result;
};

// 최신, 트레딩 조회
postSchema.statics.findPostPagination = async function (
  page: string | null,
  sort,
  language,
  period,
  isClosed,
  type,
  position,
  search,
) {
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
  const query = makeFindPostQuery(language, period, isClosed, type, position, search); // 조회 query 생성

  // Pagenation
  const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
  let pageToSkip = 0;
  if (isNumber(page) && Number(page) > 0) pageToSkip = (Number(page) - 1) * itemsPerPage;

  const posts = await this.find(query)
    .sort(sortQuery.join(' '))
    .skip(pageToSkip)
    .limit(Number(itemsPerPage))
    .select(
      `title views comments likes language isClosed totalLikes startDate endDate type onlineOrOffline contactType recruits expectedPeriod author positions createdAt`,
    )
    .populate('author', 'nickName image');
  return {
    posts,
  };
};
// 최신, 트레딩 조회
postSchema.statics.countPost = async function (language, period, isClosed, type, position, search) {
  const query = makeFindPostQuery(language, period, isClosed, type, position, search); // 조회 query 생성
  const count = await this.countDocuments(query);
  return count;
};

// 인기글 조회
postSchema.statics.findPopularPosts = async function (postId, userId) {
  // Query
  const query: any = {};

  // 14일 이내 조회
  const today = new Date();
  query.createdAt = { $gte: today.setDate(today.getDate() - 14) };

  // 현재 읽고 있는 글은 제외하고 조회
  query._id = { $ne: postId };

  // 사용자가 작성한 글 제외하고 조회
  if (userId) query.author = { $ne: userId };

  // 마감글, 인기글 제외
  query.isDeleted = { $eq: false };
  query.isClosed = { $eq: false };

  const posts = await this.find(query).sort('-views').limit(10).select('title').lean();

  return posts;
};

// 사용자에게 추천 조회
postSchema.statics.findPostRecommend = async function (sort, language, postId, userId, limit) {
  const sortQuery = [];
  // Sorting
  if (sort == false) {
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
    .select('title')
    .lean();

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
      .select('title')
      .lean();

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
  await this.findOneAndUpdate({ _id: id }, { isDeleted: true, deleteDate: new Date() });
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
  const isLikeExist = post && post.likes.indexOf(userId) > -1;
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
  await this.findByIdAndUpdate(postId, {
    $inc: {
      views: 1,
    },
  });
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

// 글 수정 권한 체크
postSchema.statics.checkPostAuthorization = async function (postId, tokenUserId, tokenType) {
  if (tokenType !== 'admin') {
    const post = await this.findOne({ _id: postId, author: tokenUserId });
    if (!post) {
      throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
    }
  }
};

// 댓글 수정 권한 체크
postSchema.statics.checkCommentAuthorization = async function (commentId, tokenUserId, tokenType) {
  if (tokenType !== 'admin') {
    const post = await this.findOne({ comments: { $elemMatch: { _id: commentId, author: tokenUserId } } });
    if (!post) {
      throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
    }
  }
};

// 대댓글 수정 권한 체크
postSchema.statics.checkReplyAuthorization = async function (replyId, tokenUserId) {
  const post = await this.findOne({ 'comments.replies': { $elemMatch: { _id: replyId, author: tokenUserId } } });
  if (!post) {
    throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
  }
};

// 글 자동 마감
postSchema.statics.autoClosing = async function () {
  const today = new Date();
  await this.updateMany(
    { $and: [{ isClosed: false }, { endDate: { $ne: null } }, { endDate: { $lte: today } }] },
    { isClosed: true },
  );
};

const Post = model<IPostDocument, IPostModel>('Post', postSchema);

export { Post };
