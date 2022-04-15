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
    totalLikes: { type: Number, default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    type: { type: String, default: null },
    recruits: { type: String, default: null },
    onlineOffline: { type: String, default: null },
    contactType: { type: String, default: null },
    contactUs: { type: String, default: null },
    udemyLecture: { type: String, default: null }, // udemy 강의
}, {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});
postSchema.virtual('hashTag').get(function () {
    var hashTag = [];
    if (this.onlineOffline)
        hashTag.push(this.onlineOffline);
    if (this.recruits && !Number.isNaN(Number(this.recruits)))
        hashTag.push("".concat(this.recruits, "\uBA85"));
    return hashTag;
});
postSchema.virtual('totalComments').get(function () {
    return this.comments.length;
});
// 최신, 트레딩 조회
postSchema.statics.findPost = function (offset, limit, sort, language, period, isClosed, type) {
    return __awaiter(this, void 0, void 0, function () {
        var offsetQuery, limitQuery, sortQuery, sortableColumns_1, query, today, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offsetQuery = parseInt(offset, 10) || 0;
                    limitQuery = parseInt(limit, 10) || 20;
                    sortQuery = [];
                    // Sorting
                    if (sort) {
                        sortableColumns_1 = ['views', 'createdAt', 'totalLikes'];
                        sortQuery = sort.split(',').filter(function (value) {
                            return sortableColumns_1.indexOf(value.substr(1, value.length)) !== -1 || sortableColumns_1.indexOf(value) !== -1;
                        });
                        sortQuery.push('-createdAt');
                    }
                    else {
                        sortQuery.push('createdAt');
                    }
                    query = {};
                    if (typeof language === 'string')
                        query.language = { $in: language.split(',') };
                    else if (typeof language === 'undefined')
                        return [2 /*return*/, []];
                    if (typeof period === 'number' && !Number.isNaN(period)) {
                        today = new Date();
                        query.createdAt = { $gte: today.setDate(today.getDate() - period) };
                    }
                    // 마감된 글 안보기 기능(false만 지원)
                    if (typeof isClosed === 'string' && !(isClosed === 'true')) {
                        query.isClosed = { $eq: isClosed === 'true' };
                    }
                    // 글 구분(1: 프로젝트, 2: 스터디)
                    if (typeof type === 'string')
                        query.type = { $eq: type };
                    return [4 /*yield*/, this.find(query)
                            .where('isDeleted')
                            .equals(false)
                            .sort(sortQuery.join(' '))
                            .skip(Number(offsetQuery))
                            .limit(Number(limitQuery))
                            .select("title views comments likes language isClosed totalLikes hashtag startDate endDate type onlineOffline contactType recruits")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
// 사용자에게 추천 조회
postSchema.statics.findPostRecommend = function (sort, language, postId, userId, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var sortQuery, sortableColumns_2, query, today, posts, notInPostIdArr, shortPosts;
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
                    }
                    else {
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
                case 0: return [4 /*yield*/, this.findOneAndUpdate({ _id: id }, { isDeleted: true })];
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
                    isLikeExist = post && post.likes.indexOf(userId) > 0;
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
                case 0: return [4 /*yield*/, this.findOneAndUpdate({ _id: postId }, {
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
postSchema.statics.checkPostAuthorization = function (postId, tokenUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ _id: postId, author: tokenUserId })];
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
// 댓글 수정 권한 체크
postSchema.statics.checkCommentAuthorization = function (commentId, tokenUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ comments: { $elemMatch: { _id: commentId, author: tokenUserId } } })];
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
var Post = (0, mongoose_1.model)('Post', postSchema);
exports.Post = Post;
//# sourceMappingURL=Post.js.map