import { Model, Schema, model, ObjectId } from 'mongoose';
import CustomError from '../CustomError';

// 대댓글
interface IReply {
  contnet: string;
  author: ObjectId;
}

interface IReplyDocument extends IReply, Document {}

// 댓글
interface IComment {
  contnet: string;
  author: ObjectId;
  replies: IReplyDocument[];
}

interface ICommentDocument extends IComment, Document {}

// 글
interface IStudy {
  _id: ObjectId;
  author: ObjectId; // 글 등록자 정보
  topic: string; // 글 주제(사용 X)
  language: string[]; // 사용 언어 리스트
  location: string; // 스터디 장소(사용 X)
  title: string; // 글 제목
  content: string; // 글 내용
  isDeleted: boolean; // 글 삭제 여부
  isClosed: boolean; // 글 마감 여부
  views: number; // 글 조회수
  comments: ICommentDocument[]; // 글 댓글 정보
  likes: ObjectId[]; // 관심 등록한 사용자 리스트
  totalLikes: number; // 관심 등록 수
}

interface IStudyModel extends Model<IStudy> {
  findStudy: (
    offset: number | null,
    limit: number | null,
    sort: string | null,
    language: string | null,
    period: number | null,
    isClosed: string | null,
  ) => Promise<IStudy>;
}

// 대댓글 스키마
const replySchema = new Schema<IReplyDocument>(
  {
    content: String, // 댓글 내용
    author: { type: Schema.Types.ObjectId, ref: 'User' }, // 댓글 등록자 정보
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
    author: { type: Schema.Types.ObjectId, ref: 'User' }, // 댓글 등록자 정보
    replies: [replySchema],
  },
  {
    versionKey: false,
    timestamps: true, // createdAt, updatedAt 컬럼 사용
  },
);

const studySchema = new Schema<IStudy, IStudyModel>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User' }, // 글 등록자 정보
    topic: String, // 글 주제(사용 X)
    language: [String], // 사용 언어 리스트
    location: String, // 스터디 장소(사용 X)
    title: String, // 글 제목
    content: String, // 글 내용
    isDeleted: { type: Boolean, default: false }, // 글 삭제 여부
    isClosed: { type: Boolean, default: false }, // 글 마감 여부
    views: { type: Number, default: 0 }, // 글 조회수
    comments: [commentSchema], // 글 댓글 정보
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 관심 등록한 사용자 리스트
    totalLikes: { type: Number, default: 0 }, // 관심 등록 수
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

studySchema.virtual('totalComments').get(function (this: IStudy) {
  return this.comments.length;
});

// schema.static('myStaticMethod', function myStaticMethod() {
//   return 42;
// });
// 최신, 트레딩 조회
studySchema.statics.findStudy = async function (offset, limit, sort, language, period, isClosed) {
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

  if (!Number.isNaN(period)) {
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
studySchema.statics.findStudyRecommend = async function (sort, language, studyId, userId, limit) {
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
  query._id = { $ne: studyId };

  // 사용자가 작성한 글 제외하고 조회
  if (userId) query.author = { $ne: userId };

  const studies = await this.find(query)
    .where('isDeleted')
    .equals(false)
    .where('isClosed')
    .equals(false)
    .sort(sortQuery.join(' '))
    .limit(limit)
    .select('-isDeleted');

  // 부족한 개수만큼 추가 조회
  if (studies.length < limit - 1) {
    const notInStudyIdArr = studies.map((study: IStudy) => {
      return study._id;
    });
    notInStudyIdArr.push(studyId);
    query._id = { $nin: notInStudyIdArr }; // 이미 조회된 글들은 중복 x
    delete query.language;
    const shortStudies = await this.find(query)
      .where('isDeleted')
      .equals(false)
      .where('isClosed')
      .equals(false)
      .sort(sortQuery.join(' '))
      .limit(limit - studies.length)
      .select('-isDeleted');
    studies.push(...shortStudies);
  }
  return studies;
};

studySchema.statics.registerComment = async function (studyId, content, author) {
  const commentId = Schema.Types.ObjectId;
  const study = await this.findOneAndUpdate(
    { _id: studyId },
    { $push: { comments: { _id: commentId, content, author } } },
    { new: true, upsert: true },
  );
  return { study, commentId };
};

studySchema.statics.registerReply = async function (studyId, commentId, content, author) {
  const replyId = Schema.Types.ObjectId;
  const study = await this.findOneAndUpdate(
    { _id: studyId, comments: { $elemMatch: { _id: commentId } } },
    { $push: { 'comments.$.replies': { _id: replyId, content, author } } },
    { new: true, upsert: true },
  );
  return { study, replyId };
};

studySchema.statics.findComments = async function (id) {
  const result = await this.findById(id)
    .populate('comments.author', 'nickName image')
    .populate('comments.replies.author', 'nickName image');
  return result;
};

studySchema.statics.deleteStudy = async function (id) {
  await this.findOneAndUpdate({ _id: id }, { isDeleted: true });
};

studySchema.statics.modifyStudy = async function (id, study) {
  const studyRecord = await this.findByIdAndUpdate({ _id: id }, study, {
    new: true,
  });
  return studyRecord;
};

// 댓글 수정
studySchema.statics.modifyComment = async function (comment) {
  const { id, content } = comment;
  const commentRecord = await this.findOneAndUpdate(
    { comments: { $elemMatch: { _id: id } } },
    { $set: { 'comments.$.content': content } },
    { new: true },
  );
  return commentRecord;
};

// 대댓글 수정
studySchema.statics.modifyReply = async function (comment) {
  const { id, content, commentId } = comment;
  const commentRecord = await this.findOneAndUpdate(
    {
      comments: { $elemMatch: { _id: commentId } },
    },
    {
      $set: { 'comments.$[].replies.$[i].content': content },
    },
    {
      arrayFilters: [{ 'i._id': id }],
      new: true,
    },
  );
  return commentRecord;
};

studySchema.statics.deleteComment = async function (id) {
  const commentRecord = await this.findOneAndUpdate(
    { comments: { $elemMatch: { _id: id } } },
    { $pull: { comments: { _id: id } } },
  );
  return commentRecord;
};

studySchema.statics.deleteReply = async function (id) {
  const commentRecord = await this.findOneAndUpdate(
    { 'comments.replies': { $elemMatch: { _id: id } } },
    { $pull: { 'comments.$.replies': { _id: id } } },
  );
  return commentRecord;
};

// 관심등록 추가
// 디바운스 실패 경우를 위해 예외처리
studySchema.statics.addLike = async function (studyId, userId) {
  const study: IStudy[] = await this.find({ _id: studyId, likes: { $in: [userId] } });
  const isLikeExist = study.length > 0;
  let result: IStudy;

  if (!isLikeExist) {
    result = await this.findByIdAndUpdate(
      { _id: studyId },
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
    result = study[study.length - 1];
  }
  return { study: result, isLikeExist };
};

studySchema.statics.deleteLike = async function (studyId, userId) {
  const studies = await this.find({ _id: studyId });
  let study: IStudy | null = studies[studies.length - 1];

  const isLikeExist = study && study.likes.indexOf(userId) > 0;
  if (isLikeExist) {
    study = await this.findOneAndUpdate(
      { _id: studyId },
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
  return { study, isLikeExist };
};

// 조회수 증가
studySchema.statics.increaseView = async function (studyId) {
  await this.findOneAndUpdate(
    { _id: studyId },
    {
      $inc: {
        views: 1,
      },
    },
  );
};

// 댓글 등록한 사용자 아이디 조회
studySchema.statics.findAuthorByCommentId = async function (commentId) {
  const study = await this.findOne({ comments: { $elemMatch: { _id: commentId } } });
  if (study) {
    const { author } = study.comments[study.comments.length - 1];
    return author;
  }
  return null;
};

// 대댓글 등록한 사용자 아이디 조회
studySchema.statics.findAuthorByReplyId = async function (replyId) {
  const study = await this.findOne({ 'comments.replies': { $elemMatch: { _id: replyId } } });
  if (study) {
    const { author } = study.comments[study.comments.length - 1];
    return author;
  }
  return null;
};

// 스터디 수정 권한 체크
studySchema.statics.checkStudyAuthorization = async function (studyId, tokenUserId) {
  const study = await this.findOne({ _id: studyId, author: tokenUserId });
  if (!study) {
    throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
  }
};

// 댓글 수정 권한 체크
studySchema.statics.checkCommentAuthorization = async function (commentId, tokenUserId) {
  const study = await this.findOne({ comments: { $elemMatch: { _id: commentId, author: tokenUserId } } });
  if (!study) {
    throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
  }
};

// 대댓글 수정 권한 체크
studySchema.statics.checkReplyAuthorization = async function (replyId, tokenUserId) {
  const study = await this.findOne({ 'comments.replies': { $elemMatch: { _id: replyId, author: tokenUserId } } });
  if (!study) {
    throw new CustomError('NotAuthenticatedError', 401, 'User does not match');
  }
};

const Study = model<IStudy, IStudyModel>('Study', studySchema);

export default Study;
