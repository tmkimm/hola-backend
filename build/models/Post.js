"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
var mongoose_1 = require("mongoose");
var CustomError_1 = __importDefault(require("../CustomError"));
var isNumber_1 = require("../utills/isNumber");
// 대댓글 스키마
var replySchema = new mongoose_1.Schema({
    content: String,
    author: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true }, // 댓글 등록자 정보
}, {
    versionKey: false,
    timestamps: true, // createdAt, updatedAt 컬럼 사용
});
// 댓글 스키마
var commentSchema = new mongoose_1.Schema({
    content: String,
    author: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    replies: [replySchema],
}, {
    versionKey: false,
    timestamps: true, // createdAt, updatedAt 컬럼 사용
});
var postSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    language: { type: [String], validate: function (v) { return Array.isArray(v) && v.length > 0; } },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    comments: [commentSchema],
    likes: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }],
    totalLikes: { type: Number, default: 0 },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    type: { type: String, default: null },
    recruits: { type: String, default: null },
    onlineOrOffline: { type: String, default: null },
    contactType: { type: String, default: null },
    contactPoint: { type: String, default: null },
    udemyLecture: { type: String, default: null },
    expectedPeriod: { type: String, default: null },
    positions: { type: [String] },
    closeDate: { type: Date, default: null },
    deleteDate: { type: Date, default: null }, //  삭제일
}, {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});
// 글 상태(뱃지)
postSchema.virtual('state').get(function () {
    var state = '';
    // 글 상태
    var today = new Date();
    var daysAgo = new Date();
    var millisecondDay = 1000 * 60 * 60 * 24;
    daysAgo.setDate(today.getDate() - 1); // 24시간 이내
    // 1. 3일 이내에 등록된 글이면 최신 글
    // 2. 3일 이내 글이면 마감 임박
    // 3. 일 조회수가 60 이상이면 인기
    if (this.createdAt > daysAgo)
        state = 'new';
    else if (this.startDate > today && (this.startDate.getTime() - today.getTime()) / millisecondDay <= 3)
        state = 'deadline';
    else if (Math.abs(this.views / Math.ceil((today.getTime() - this.createdAt.getTime()) / millisecondDay)) >= 60)
        state = 'hot';
    return state;
});
postSchema.virtual('totalComments').get(function () {
    return this.comments.length;
});
// 조회 query 생성
var makeFindPostQuery = function (language, period, isClosed, type, position, search) {
    // Query
    var query = {};
    if (typeof language === 'string')
        query.language = { $in: language.split(',') };
    if (typeof position === 'string' && position && position !== 'ALL')
        query.positions = position;
    if (typeof period === 'number' && !Number.isNaN(period)) {
        var today = new Date();
        query.createdAt = { $gte: today.setDate(today.getDate() - period) };
    }
    // 마감된 글 안보기 기능(false만 지원)
    if (typeof isClosed === 'string' && isClosed === 'false') {
        query.isClosed = { $eq: false };
    }
    query.isDeleted = { $eq: false };
    // 글 구분(0: 전체, 1: 프로젝트, 2: 스터디)
    if (typeof type === 'string') {
        if (type === '0')
            query.$or = [{ type: '1' }, { type: '2' }];
        else
            query.type = { $eq: type };
    }
    // 텍스트 검색
    if (typeof search === 'string') {
        query.$text = { $search: search };
    }
    return query;
};
// 최신, 트레딩 조회
postSchema.statics.findTopPost = function (limit, sort) {
    return __awaiter(this, void 0, void 0, function () {
        var limitQuery, sortQuery, sortableColumns_1, today, daysAgo, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    limitQuery = parseInt(limit, 10) || 6;
                    sortQuery = [];
                    // Sorting
                    if (sort) {
                        sortableColumns_1 = ['views', 'createdAt', 'totalLikes'];
                        sortQuery = sort.split(',').filter(function (value) {
                            return sortableColumns_1.indexOf(value.substr(1, value.length)) !== -1 || sortableColumns_1.indexOf(value) !== -1;
                        });
                    }
                    else {
                        sortQuery.push('-views');
                    }
                    today = new Date();
                    daysAgo = new Date();
                    daysAgo.setDate(today.getDate() - 7); // 7일 이내
                    return [4 /*yield*/, this.find({ createdAt: { $gte: daysAgo } })
                            .where('isDeleted')
                            .equals(false)
                            .where('isClosed')
                            .equals(false)
                            .sort(sortQuery.join(' '))
                            .limit(Number(limitQuery))
                            .select("title views comments likes language isClosed totalLikes startDate endDate type onlineOrOffline contactType recruits expectedPeriod author positions createdAt")
                            .populate('author', 'nickName image')];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
// 최신, 트레딩 조회
postSchema.statics.findPostPagination = function (page, sort, language, period, isClosed, type, position, search) {
    return __awaiter(this, void 0, void 0, function () {
        var sortQuery, sortableColumns_2, query, itemsPerPage, pageToSkip, posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sortQuery = [];
                    // Sorting
                    if (sort) {
                        sortableColumns_2 = ['views', 'createdAt', 'totalLikes'];
                        sortQuery = sort.split(',').filter(function (value) {
                            return sortableColumns_2.indexOf(value.substr(1, value.length)) !== -1 || sortableColumns_2.indexOf(value) !== -1;
                        });
                        sortQuery.push('-createdAt');
                    }
                    else {
                        sortQuery.push('createdAt');
                    }
                    query = makeFindPostQuery(language, period, isClosed, type, position, search);
                    itemsPerPage = 4 * 5;
                    pageToSkip = 0;
                    if ((0, isNumber_1.isNumber)(page) && Number(page) > 0)
                        pageToSkip = (Number(page) - 1) * itemsPerPage;
                    return [4 /*yield*/, this.find(query)
                            .sort(sortQuery.join(' '))
                            .skip(pageToSkip)
                            .limit(Number(itemsPerPage))
                            .select("title views comments likes language isClosed totalLikes startDate endDate type onlineOrOffline contactType recruits expectedPeriod author positions createdAt")
                            .populate('author', 'nickName image')];
                case 1:
                    posts = _a.sent();
                    return [2 /*return*/, {
                            posts: posts,
                        }];
            }
        });
    });
};
// 최신, 트레딩 조회
postSchema.statics.countPost = function (language, period, isClosed, type, position, search) {
    return __awaiter(this, void 0, void 0, function () {
        var query, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = makeFindPostQuery(language, period, isClosed, type, position, search);
                    return [4 /*yield*/, this.countDocuments(query)];
                case 1:
                    count = _a.sent();
                    return [2 /*return*/, count];
            }
        });
    });
};
// 인기글 조회
postSchema.statics.findPopularPosts = function (postId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var query, today, posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = {};
                    today = new Date();
                    query.createdAt = { $gte: today.setDate(today.getDate() - 14) };
                    // 현재 읽고 있는 글은 제외하고 조회
                    query._id = { $ne: postId };
                    // 사용자가 작성한 글 제외하고 조회
                    if (userId)
                        query.author = { $ne: userId };
                    // 마감글, 인기글 제외
                    query.isDeleted = { $eq: false };
                    query.isClosed = { $eq: false };
                    return [4 /*yield*/, this.find(query).sort('-views').limit(10).select('title').lean()];
                case 1:
                    posts = _a.sent();
                    return [2 /*return*/, posts];
            }
        });
    });
};
// 사용자에게 추천 조회
postSchema.statics.findPostRecommend = function (sort, language, postId, userId, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var sortQuery, query, today, posts, notInPostIdArr, shortPosts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sortQuery = [];
                    // Sorting
                    if (sort === false) {
                        sortQuery.push('createdAt');
                    }
                    query = {};
                    if (typeof language === 'object' && language.length > 0)
                        query.language = { $in: language };
                    today = new Date();
                    query.createdAt = { $gte: today.setDate(today.getDate() - 14) };
                    // 현재 읽고 있는 글은 제외하고 조회
                    query._id = { $ne: postId };
                    // 사용자가 작성한 글 제외하고 조회
                    if (userId)
                        query.author = { $ne: userId };
                    return [4 /*yield*/, this.find(query)
                            .where('isDeleted')
                            .equals(false)
                            .where('isClosed')
                            .equals(false)
                            .sort(sortQuery.join(' '))
                            .limit(limit)
                            .select('title')
                            .lean()];
                case 1:
                    posts = _a.sent();
                    if (!(posts.length < limit - 1)) return [3 /*break*/, 3];
                    notInPostIdArr = posts.map(function (post) {
                        return post._id;
                    });
                    notInPostIdArr.push(postId);
                    query._id = { $nin: notInPostIdArr }; // 이미 조회된 글들은 중복 x
                    delete query.language;
                    return [4 /*yield*/, this.find(query)
                            .where('isDeleted')
                            .equals(false)
                            .where('isClosed')
                            .equals(false)
                            .sort(sortQuery.join(' '))
                            .limit(limit - posts.length)
                            .select('title')
                            .lean()];
                case 2:
                    shortPosts = _a.sent();
                    posts.push.apply(posts, shortPosts);
                    _a.label = 3;
                case 3: return [2 /*return*/, posts];
            }
        });
    });
};
postSchema.statics.registerComment = function (postId, content, author) {
    return __awaiter(this, void 0, void 0, function () {
        var commentId, post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commentId = new mongoose_1.Types.ObjectId();
                    return [4 /*yield*/, this.findOneAndUpdate({ _id: postId }, { $push: { comments: { _id: commentId, content: content, author: author } } }, { new: true, upsert: true })];
                case 1:
                    post = _a.sent();
                    return [2 /*return*/, { post: post, commentId: commentId }];
            }
        });
    });
};
postSchema.statics.registerReply = function (postId, commentId, content, author) {
    return __awaiter(this, void 0, void 0, function () {
        var replyId, post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    replyId = new mongoose_1.Types.ObjectId();
                    return [4 /*yield*/, this.findOneAndUpdate({ _id: postId, comments: { $elemMatch: { _id: commentId } } }, { $push: { 'comments.$.replies': { _id: replyId, content: content, author: author } } }, { new: true, upsert: true })];
                case 1:
                    post = _a.sent();
                    return [2 /*return*/, { post: post, replyId: replyId }];
            }
        });
    });
};
postSchema.statics.findComments = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findById(id)
                        .populate('comments.author', 'nickName image')
                        .populate('comments.replies.author', 'nickName image')];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
postSchema.statics.deletePost = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOneAndUpdate({ _id: id }, { isDeleted: true, deleteDate: new Date() })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
postSchema.statics.modifyPost = function (id, post) {
    return __awaiter(this, void 0, void 0, function () {
        var postRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findByIdAndUpdate({ _id: id }, post, {
                        new: true,
                    })];
                case 1:
                    postRecord = _a.sent();
                    return [2 /*return*/, postRecord];
            }
        });
    });
};
// 댓글 수정
postSchema.statics.modifyComment = function (comment) {
    return __awaiter(this, void 0, void 0, function () {
        var _id, content, commentRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _id = comment._id, content = comment.content;
                    return [4 /*yield*/, this.findOneAndUpdate({ comments: { $elemMatch: { _id: _id } } }, { $set: { 'comments.$.content': content } }, { new: true })];
                case 1:
                    commentRecord = _a.sent();
                    return [2 /*return*/, commentRecord];
            }
        });
    });
};
// 대댓글 수정
postSchema.statics.modifyReply = function (comment) {
    return __awaiter(this, void 0, void 0, function () {
        var _id, content, commentId, commentRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _id = comment._id, content = comment.content, commentId = comment.commentId;
                    return [4 /*yield*/, this.findOneAndUpdate({
                            comments: { $elemMatch: { _id: commentId } },
                        }, {
                            $set: { 'comments.$[].replies.$[i].content': content },
                        }, {
                            arrayFilters: [{ 'i._id': _id }],
                            new: true,
                        })];
                case 1:
                    commentRecord = _a.sent();
                    return [2 /*return*/, commentRecord];
            }
        });
    });
};
postSchema.statics.deleteComment = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        var commentRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOneAndUpdate({ comments: { $elemMatch: { _id: id } } }, { $pull: { comments: { _id: id } } })];
                case 1:
                    commentRecord = _a.sent();
                    return [2 /*return*/, commentRecord];
            }
        });
    });
};
postSchema.statics.deleteReply = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        var commentRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOneAndUpdate({ 'comments.replies': { $elemMatch: { _id: id } } }, { $pull: { 'comments.$.replies': { _id: id } } })];
                case 1:
                    commentRecord = _a.sent();
                    return [2 /*return*/, commentRecord];
            }
        });
    });
};
// 관심등록 추가
// 디바운스 실패 경우를 위해 예외처리
postSchema.statics.addLike = function (postId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var post, isLikeExist, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.find({ _id: postId, likes: { $in: [userId] } })];
                case 1:
                    post = _a.sent();
                    isLikeExist = post.length > 0;
                    if (!!isLikeExist) return [3 /*break*/, 3];
                    return [4 /*yield*/, this.findByIdAndUpdate({ _id: postId }, {
                            $push: {
                                likes: {
                                    _id: userId,
                                },
                            },
                            $inc: {
                                totalLikes: 1,
                            },
                        }, {
                            new: true,
                            upsert: true,
                        })];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    result = post[post.length - 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, { post: result, isLikeExist: isLikeExist }];
            }
        });
    });
};
postSchema.statics.deleteLike = function (postId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var posts, post, isLikeExist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.find({ _id: postId })];
                case 1:
                    posts = _a.sent();
                    post = posts[posts.length - 1];
                    isLikeExist = post && post.likes.indexOf(userId) > -1;
                    if (!isLikeExist) return [3 /*break*/, 3];
                    return [4 /*yield*/, this.findOneAndUpdate({ _id: postId }, {
                            $pull: { likes: userId },
                            $inc: {
                                totalLikes: -1,
                            },
                        }, {
                            new: true,
                        })];
                case 2:
                    post = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, { post: post, isLikeExist: isLikeExist }];
            }
        });
    });
};
// 조회수 증가
postSchema.statics.increaseView = function (postId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findByIdAndUpdate(postId, {
                        $inc: {
                            views: 1,
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// 댓글 등록한 사용자 아이디 조회
postSchema.statics.findAuthorByCommentId = function (commentId) {
    return __awaiter(this, void 0, void 0, function () {
        var post, author;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ comments: { $elemMatch: { _id: commentId } } })];
                case 1:
                    post = _a.sent();
                    if (post) {
                        author = post.comments[post.comments.length - 1].author;
                        return [2 /*return*/, author];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
};
// 대댓글 등록한 사용자 아이디 조회
postSchema.statics.findAuthorByReplyId = function (replyId) {
    return __awaiter(this, void 0, void 0, function () {
        var post, author;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ 'comments.replies': { $elemMatch: { _id: replyId } } })];
                case 1:
                    post = _a.sent();
                    if (post) {
                        author = post.comments[post.comments.length - 1].author;
                        return [2 /*return*/, author];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
};
// 글 수정 권한 체크
postSchema.statics.checkPostAuthorization = function (postId, tokenUserId, tokenType) {
    return __awaiter(this, void 0, void 0, function () {
        var post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(tokenType !== 'admin')) return [3 /*break*/, 2];
                    return [4 /*yield*/, this.findOne({ _id: postId, author: tokenUserId })];
                case 1:
                    post = _a.sent();
                    if (!post) {
                        throw new CustomError_1.default('NotAuthenticatedError', 401, 'User does not match');
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
};
// 댓글 수정 권한 체크
postSchema.statics.checkCommentAuthorization = function (commentId, tokenUserId, tokenType) {
    return __awaiter(this, void 0, void 0, function () {
        var post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(tokenType !== 'admin')) return [3 /*break*/, 2];
                    return [4 /*yield*/, this.findOne({ comments: { $elemMatch: { _id: commentId, author: tokenUserId } } })];
                case 1:
                    post = _a.sent();
                    if (!post) {
                        throw new CustomError_1.default('NotAuthenticatedError', 401, 'User does not match');
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
};
// 대댓글 수정 권한 체크
postSchema.statics.checkReplyAuthorization = function (replyId, tokenUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ 'comments.replies': { $elemMatch: { _id: replyId, author: tokenUserId } } })];
                case 1:
                    post = _a.sent();
                    if (!post) {
                        throw new CustomError_1.default('NotAuthenticatedError', 401, 'User does not match');
                    }
                    return [2 /*return*/];
            }
        });
    });
};
// 글 자동 마감
postSchema.statics.autoClosing = function () {
    return __awaiter(this, void 0, void 0, function () {
        var today;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    today = new Date();
                    return [4 /*yield*/, this.updateMany({ $and: [{ isClosed: false }, { endDate: { $ne: null } }, { endDate: { $lte: today } }] }, { isClosed: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var Post = (0, mongoose_1.model)('Post', postSchema);
exports.Post = Post;
//# sourceMappingURL=Post.js.map