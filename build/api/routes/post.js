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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var User_1 = require("../../models/User");
var index_1 = require("../middlewares/index");
var index_2 = require("../../services/index");
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var Post_1 = require("../../models/Post");
var Notification_1 = require("../../models/Notification");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /*
      글에 관련된 Router를 정의한다.
      등록 / 수정 / 삭제하려는 사용자의 정보는 Access Token을 이용하여 처리한다.
      
      # GET /posts : 글 리스트 조회(pagenation, sort, query select)
      # POST /posts/ : 신규 글 등록
      # GET /posts/:id : 글 상세 정보 조회
      # PATCH /posts/:id : 글 정보 수정
      # DELETE /posts/:id : 글 삭제
  
      # POST /posts/likes : 좋아요 등록
      # DELETE /posts/likes/:id : 좋아요 삭제
      */
    app.use('/posts', route);
    // 글 리스트 조회
    route.get('/', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, offset, limit, sort, language, period, isClosed, type, PostServiceInstance, posts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.query, offset = _a.offset, limit = _a.limit, sort = _a.sort, language = _a.language, period = _a.period, isClosed = _a.isClosed, type = _a.type;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.findPost(offset, limit, sort, language, period, isClosed, type)];
                case 1:
                    posts = _b.sent();
                    return [2 /*return*/, res.status(200).json(posts)];
            }
        });
    }); }));
    // 메인에서의 글 추천
    route.get('/recommend', index_1.getUserIdByAccessToken, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, PostServiceInstance, posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = req.user._id;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.recommendToUserFromMain(userId)];
                case 1:
                    posts = _a.sent();
                    return [2 /*return*/, res.status(200).json(posts)];
            }
        });
    }); }));
    // 글에서의 글 추천
    route.get('/:id/recommend', index_1.getUserIdByAccessToken, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var postId, userId, PostServiceInstance, post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    postId = req.params.id;
                    userId = req.user._id;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.recommendToUserFromPost(mongoose_1.Types.ObjectId(postId), userId)];
                case 1:
                    post = _a.sent();
                    return [2 /*return*/, res.status(200).json(post)];
            }
        });
    }); }));
    // 글 상세 보기
    // 로그인된 사용자일 경우 읽은 목록을 추가한다.
    route.get('/:id', index_1.isPostIdValid, index_1.getUserIdByAccessToken, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var postId, userId, readList, PostServiceInstance, post, _a, updateReadList, isAlreadyRead, untilMidnight;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    postId = req.params.id;
                    userId = req.user._id;
                    readList = req.cookies.RVIEW;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.findPostDetail(mongoose_1.Types.ObjectId(postId))];
                case 1:
                    post = _b.sent();
                    return [4 /*yield*/, PostServiceInstance.increaseView(mongoose_1.Types.ObjectId(postId), userId, readList)];
                case 2:
                    _a = _b.sent(), updateReadList = _a.updateReadList, isAlreadyRead = _a.isAlreadyRead;
                    if (!isAlreadyRead) {
                        untilMidnight = new Date();
                        untilMidnight.setHours(24, 0, 0, 0);
                        res.cookie('RVIEW', updateReadList, {
                            sameSite: 'none',
                            httpOnly: true,
                            secure: true,
                            expires: untilMidnight,
                        });
                    }
                    return [2 /*return*/, res.status(200).json(post)];
            }
        });
    }); }));
    // 사용자의 글 관심 등록 여부
    route.get('/:id/isLiked', index_1.getUserIdByAccessToken, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var postId, userId, PostServiceInstance, isLiked;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    postId = req.params.id;
                    userId = req.user._id;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.findUserLiked(mongoose_1.Types.ObjectId(postId), userId)];
                case 1:
                    isLiked = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            isLiked: isLiked,
                        })];
            }
        });
    }); }));
    // 글의 관심 등록한 사용자 리스트 조회
    route.get('/:id/likes', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var postId, PostServiceInstance, likeUsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    postId = req.params.id;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.findLikeUsers(mongoose_1.Types.ObjectId(postId))];
                case 1:
                    likeUsers = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            likeUsers: likeUsers,
                        })];
            }
        });
    }); }));
    // 글 등록
    route.post('/', index_1.checkPost, index_1.isPostValid, index_1.isAccessTokenValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var postDTO, userId, PostServiceInstance, post, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        postDTO = req.body;
                        userId = req.user._id;
                        PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                        return [4 /*yield*/, PostServiceInstance.registerPost(userId, postDTO)];
                    case 1:
                        post = _a.sent();
                        return [2 /*return*/, res.status(201).json(post)];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                errors: [
                                    {
                                        location: 'body',
                                        param: 'name',
                                        error: 'TypeError',
                                        message: 'must be String',
                                    },
                                ],
                                error: error_1,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }));
    // 글 수정
    route.patch('/:id', index_1.isAccessTokenValid, index_1.checkPost, index_1.isPostValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, tokenUserId, postDTO, PostServiceInstance, post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    tokenUserId = req.user._id;
                    postDTO = req.body;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.modifyPost(mongoose_1.Types.ObjectId(id), tokenUserId, postDTO)];
                case 1:
                    post = _a.sent();
                    return [2 /*return*/, res.status(200).json(post)];
            }
        });
    }); }));
    // 글 글 삭제
    route.delete('/:id', index_1.isPostIdValid, index_1.isAccessTokenValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, tokenUserId, PostServiceInstance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    tokenUserId = req.user._id;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.deletePost(mongoose_1.Types.ObjectId(id), tokenUserId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res.status(204).json()];
            }
        });
    }); }));
    // 좋아요 등록
    route.post('/likes', index_1.isAccessTokenValid, index_1.isPostIdValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var postId, userId, PostServiceInstance, post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    postId = req.body.postId;
                    userId = req.user._id;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.addLike(mongoose_1.Types.ObjectId(postId), userId)];
                case 1:
                    post = _a.sent();
                    return [2 /*return*/, res.status(201).json({ likeUsers: post.likes })];
            }
        });
    }); }));
    // 좋아요 삭제
    route.delete('/likes/:id', index_1.isAccessTokenValid, index_1.isPostIdValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var postId, userId, PostServiceInstance, post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    postId = req.params.id;
                    userId = req.user._id;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.deleteLike(mongoose_1.Types.ObjectId(postId), userId)];
                case 1:
                    post = _a.sent();
                    return [2 /*return*/, res.status(201).json({ likeUsers: post.likes })];
            }
        });
    }); }));
});
//# sourceMappingURL=post.js.map