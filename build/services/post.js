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
exports.PostService = void 0;
var sanitize_html_1 = __importDefault(require("sanitize-html"));
var ReadPosts_1 = require("../models/ReadPosts");
var LikePosts_1 = require("../models/LikePosts");
var timeForEndDate_1 = require("../utills/timeForEndDate");
var CustomError_1 = __importDefault(require("../CustomError"));
var PostService = /** @class */ (function () {
    function PostService(postModel, userModel, notificationModel) {
        this.postModel = postModel;
        this.userModel = userModel;
        this.notificationModel = notificationModel;
    }
    // 이번주 인기글 조회
    PostService.prototype.findTopPost = function () {
        return __awaiter(this, void 0, void 0, function () {
            var posts, today, postArr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.findTopPost(10, '-views')];
                    case 1:
                        posts = _a.sent();
                        today = new Date();
                        postArr = posts.map(function (post) {
                            post = post.toObject({ virtuals: true });
                            post.badge = [];
                            if (post.startDate > today) {
                                post.badge.push({
                                    type: 'deadline',
                                    name: "".concat((0, timeForEndDate_1.timeForEndDate)(post.startDate)),
                                });
                            }
                            return post;
                        });
                        return [2 /*return*/, postArr];
                }
            });
        });
    };
    // 메인 화면에서 글 리스트를 조회한다.
    PostService.prototype.findPostPagination = function (page, sort, language, period, isClosed, type, position, search, userId, onOffLine) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.findPostPagination(page, sort, language, period, isClosed, type, position, search, onOffLine)];
                    case 1:
                        result = _a.sent();
                        result = this.addPostVirtualField(result, userId);
                        return [2 /*return*/, { posts: result }];
                }
            });
        });
    };
    // mongoose virtual field 추가
    // mongodb text search를 위해 aggregate 사용 시 virtual field가 조회되지 않음 > 수동 추가
    // isLiked : 사용자의 관심 등록 여부
    // state : 상태 뱃지
    // totalComments : 댓글 수
    PostService.prototype.addPostVirtualField = function (posts, userId) {
        var result = [];
        // 글 상태
        var today = new Date();
        var daysAgo = new Date();
        var millisecondDay = 1000 * 60 * 60 * 24;
        daysAgo.setDate(today.getDate() - 1); // 24시간 이내
        result = posts.map(function (post) {
            var isLiked = false;
            // add isLiked
            if (userId != null && post.likes && post.likes.length > 0) {
                // ObjectId 특성 상 IndexOf를 사용할 수 없어 loop로 비교(리팩토링 필요)
                for (var _i = 0, _a = post.likes; _i < _a.length; _i++) {
                    var likeUserId = _a[_i];
                    if (likeUserId.toString() == userId.toString()) {
                        isLiked = true;
                        break;
                    }
                }
            }
            post.isLiked = isLiked;
            // set Author info
            if (post.author.length > 0)
                post.author = post.author[post.author.length - 1];
            // add totalComments
            post.totalComments = post.comments.length;
            // add state
            // 1. 3일 이내에 등록된 글이면 최신 글
            // 2. 3일 이내 글이면 마감 임박
            // 3. 일 조회수가 60 이상이면 인기
            if (post.createdAt > daysAgo)
                post.state = 'new';
            else if (post.startDate > today && (post.startDate.getTime() - today.getTime()) / millisecondDay <= 3)
                post.state = 'deadline';
            else if (Math.abs(post.views / Math.ceil((today.getTime() - post.createdAt.getTime()) / millisecondDay)) >= 60)
                post.state = 'hot';
            else
                post.state = '';
            return post;
        });
        return result;
    };
    // Pagination을 위해 마지막 페이지를 구한다.
    PostService.prototype.findLastPage = function (language, period, isClosed, type, position, search, onOffLine) {
        return __awaiter(this, void 0, void 0, function () {
            var itemsPerPage, totalCount, lastPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        itemsPerPage = 4 * 5;
                        return [4 /*yield*/, this.postModel.countPost(language, period, isClosed, type, position, search, onOffLine)];
                    case 1:
                        totalCount = _a.sent();
                        lastPage = Math.ceil(totalCount / itemsPerPage);
                        return [2 /*return*/, lastPage];
                }
            });
        });
    };
    // 인기글 조회
    PostService.prototype.findPopularPosts = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var posts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.findPopularPosts(postId, userId)];
                    case 1:
                        posts = _a.sent();
                        return [2 /*return*/, posts];
                }
            });
        });
    };
    // 메인 화면에서 글를 추천한다.(현재 미사용, 제거예정)
    PostService.prototype.recommendToUserFromMain = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var sort, likeLanguages, limit, user, posts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        likeLanguages = null;
                        limit = 20;
                        if (!userId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.userModel.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (user !== null && user.likeLanguages)
                            likeLanguages = user.likeLanguages;
                        sort = 'views';
                        return [3 /*break*/, 3];
                    case 2:
                        sort = 'totalLikes';
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.postModel.findPostRecommend('-views', likeLanguages, null, null, limit)];
                    case 4:
                        posts = _a.sent();
                        return [2 /*return*/, posts];
                }
            });
        });
    };
    // 글에서 글를 추천한다.
    PostService.prototype.recommendToUserFromPost = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var sort, language, limit, post, posts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sort = '-views';
                        language = null;
                        limit = 10;
                        if (!postId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.postModel.findById(postId)];
                    case 1:
                        post = _a.sent();
                        if (post === null)
                            throw new CustomError_1.default('JsonWebTokenError', 404, 'Post not found');
                        language = post.language;
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.postModel.findPostRecommend(sort, language, postId, userId, limit)];
                    case 3:
                        posts = _a.sent();
                        return [2 /*return*/, posts];
                }
            });
        });
    };
    // 조회수 증가
    PostService.prototype.increaseView = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!userId) return [3 /*break*/, 4];
                        _b = (_a = Promise).all;
                        return [4 /*yield*/, ReadPosts_1.ReadPosts.insertIfNotExist(postId, userId)];
                    case 1:
                        _c = [_d.sent()];
                        return [4 /*yield*/, this.postModel.increaseView(postId)];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.concat([_d.sent()])])];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.postModel.increaseView(postId)];
                    case 5:
                        _d.sent(); // 조회수 증가
                        _d.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // 상세 글 정보를 조회한다.
    // 로그인된 사용자일 경우 읽은 목록을 추가한다.
    PostService.prototype.findPostDetail = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var posts, postToObject, today, badge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.findById(postId).populate('author', 'nickName image')];
                    case 1:
                        posts = _a.sent();
                        if (!posts)
                            throw new CustomError_1.default('NotFoundError', 404, 'Post not found');
                        postToObject = posts.toObject({ virtuals: true });
                        today = new Date();
                        badge = [];
                        if (postToObject.startDate > today) {
                            badge.push({
                                type: 'deadline',
                                name: "".concat((0, timeForEndDate_1.timeForEndDate)(postToObject.startDate)),
                            });
                        }
                        postToObject.badge = badge;
                        return [4 /*yield*/, this.increaseView(postId, userId)];
                    case 2:
                        _a.sent(); // 조회수 증가
                        return [2 /*return*/, postToObject];
                }
            });
        });
    };
    // 사용자의 관심 등록 여부를 조회한다.
    PostService.prototype.findUserLiked = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var posts, isLiked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(userId && postId)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.postModel.find({ _id: postId, likes: userId })];
                    case 1:
                        posts = _a.sent();
                        isLiked = posts.length > 0;
                        return [2 /*return*/, isLiked];
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    };
    // 글의 관심 등록한 사용자 리스트를 조회한다.
    PostService.prototype.findLikeUsers = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            var likeUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.findById(postId).select('likes')];
                    case 1:
                        likeUsers = _a.sent();
                        if (!likeUsers)
                            return [2 /*return*/, []];
                        return [2 /*return*/, likeUsers.likes];
                }
            });
        });
    };
    // 신규 글를 등록한다.
    PostService.prototype.registerPost = function (userID, post) {
        return __awaiter(this, void 0, void 0, function () {
            var cleanHTML, postRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        post.author = userID;
                        if (post.content) {
                            cleanHTML = (0, sanitize_html_1.default)(post.content, {
                                allowedTags: sanitize_html_1.default.defaults.allowedTags.concat(['img']),
                            });
                            post.content = cleanHTML;
                        }
                        return [4 /*yield*/, this.postModel.create(post)];
                    case 1:
                        postRecord = _a.sent();
                        return [2 /*return*/, postRecord];
                }
            });
        });
    };
    // 글 정보를 수정한다.
    PostService.prototype.modifyPost = function (id, tokenUserId, tokenType, post) {
        return __awaiter(this, void 0, void 0, function () {
            var cleanHTML, postRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.checkPostAuthorization(id, tokenUserId, tokenType)];
                    case 1:
                        _a.sent(); // 접근 권한 체크
                        if (post.content) {
                            cleanHTML = (0, sanitize_html_1.default)(post.content, {
                                allowedTags: sanitize_html_1.default.defaults.allowedTags.concat(['img']),
                            });
                            post.content = cleanHTML;
                        }
                        return [4 /*yield*/, this.postModel.modifyPost(id, post)];
                    case 2:
                        postRecord = _a.sent();
                        return [2 /*return*/, postRecord];
                }
            });
        });
    };
    // 글를 삭제한다.
    PostService.prototype.deletePost = function (id, tokenUserId, tokenType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.checkPostAuthorization(id, tokenUserId, tokenType)];
                    case 1:
                        _a.sent(); // 접근 권한 체크
                        return [4 /*yield*/, this.postModel.deletePost(id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.notificationModel.deleteNotificationByPost(id)];
                    case 3:
                        _a.sent(); // 글 삭제 시 관련 알림 제거
                        return [2 /*return*/];
                }
            });
        });
    };
    // 관심 등록 추가
    PostService.prototype.addLike = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, post, isLikeExist;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.postModel.addLike(postId, userId)];
                    case 1:
                        _a = _b.sent(), post = _a.post, isLikeExist = _a.isLikeExist;
                        if (!!isLikeExist) return [3 /*break*/, 3];
                        return [4 /*yield*/, LikePosts_1.LikePosts.add(postId, userId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, post];
                }
            });
        });
    };
    // 관심 등록 취소(삭제)
    PostService.prototype.deleteLike = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, post, isLikeExist;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.postModel.deleteLike(postId, userId)];
                    case 1:
                        _a = _b.sent(), post = _a.post, isLikeExist = _a.isLikeExist;
                        if (!isLikeExist) return [3 /*break*/, 3];
                        return [4 /*yield*/, LikePosts_1.LikePosts.delete(postId, userId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, post];
                }
            });
        });
    };
    // 자동 마감
    PostService.prototype.autoClosing = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.autoClosing()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PostService;
}());
exports.PostService = PostService;
//# sourceMappingURL=post.js.map