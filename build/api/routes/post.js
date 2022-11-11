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
    /**
     * @swagger
     * tags:
          - name: posts
            description: 글에 관련된 API
     */
    app.use('/posts', route);
    /**
     * @swagger
     * paths:
     *   /posts:
     *    get:
     *      tags:
     *        - posts
     *      summary: 글 리스트 조회(메인)
     *      description: 메인 페이지에서 글 리스트를 조회한다.
     *      parameters:
     *        - name: language
     *          in: query
     *          description: 사용 언어
     *          required: false
     *          schema:
     *            type: string
     *          example: 'react,java'
     *        - name: offset
     *          in: query
     *          description: 건너뛸 개수
     *          required: true
     *          schema:
     *            type: string
     *          example: 00
     *        - name: limit
     *          in: query
     *          description: 조회할 개수
     *          required: true
     *          schema:
     *            type: string
     *          example: 20
     *        - name: sort
     *          in: query
     *          description: '정렬. 필드는 ,로 구분하며 +는 오름차순, -는 내림차순 '
     *          required: false
     *          schema:
     *            type: string
     *          example: '-createdAt,+views'
     *        - name: position
     *          in: query
     *          description: '직군(FE: 프론트엔드, BE: 백엔드, DE: 디자이너, IOS: IOS, AND: 안드로이드, DEVOPS: DevOps, PM)'
     *          required: false
     *          schema:
     *            type: string
     *          example: 'FE,IOS'
     *        - name: type
     *          in: query
     *          description: '모집 구분(1 : 프로젝트, 2: 스터디)'
     *          required: false
     *          schema:
     *            type: string
     *          example: '1'
     *        - name: period
     *          in: query
     *          description: '조회 기간(일). 14일 경우 14일 이내의 글만 조회'
     *          required: false
     *          schema:
     *            type: string
     *          example: 14
     *        - name: isClosed
     *          in: query
     *          description: '마감여부(true, false)'
     *          required: false
     *          schema:
     *            type: string
     *          example: true
     *        - name: search
     *          in: query
     *          description: '검색'
     *          required: false
     *          schema:
     *            type: string
     *          example: '토이프로젝트'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Post'
     */
    route.get('/', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, offset, limit, sort, language, period, isClosed, type, position, search, PostServiceInstance, posts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.query, offset = _a.offset, limit = _a.limit, sort = _a.sort, language = _a.language, period = _a.period, isClosed = _a.isClosed, type = _a.type, position = _a.position, search = _a.search;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.findPost(offset, limit, sort, language, period, isClosed, type, position, search)];
                case 1:
                    posts = _b.sent();
                    return [2 /*return*/, res.status(200).json(posts)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /posts/pagination:
     *    get:
     *      tags:
     *        - posts
     *      summary: 글 리스트 조회(페이징)
     *      description: 메인 페이지에서 글 리스트를 조회한다.
     *      parameters:
     *        - name: language
     *          in: query
     *          description: 사용 언어
     *          required: false
     *          schema:
     *            type: string
     *          example: 'react,java'
     *        - name: page
     *          in: query
     *          description: 현재 페이지(기본 1)
     *          required: true
     *          schema:
     *            type: number
     *          example: 3
     *        - name: previousPage
     *          in: query
     *          description: 이전 페이지(기본 1)
     *          required: true
     *          schema:
     *            type: string
     *          example: 2
     *        - name: lastId
     *          in: query
     *          description: 조회된 리스트의 마지막 ID
     *          required: true
     *          schema:
     *            type: string
     *          example: '62f4999837ad67001405a6dd'
     *        - name: sort
     *          in: query
     *          description: '정렬. 필드는 ,로 구분하며 +는 오름차순, -는 내림차순 '
     *          required: false
     *          schema:
     *            type: string
     *          example: '-createdAt,+views'
     *        - name: position
     *          in: query
     *          description: '직군(FE: 프론트엔드, BE: 백엔드, DE: 디자이너, IOS: IOS, AND: 안드로이드, DEVOPS: DevOps, PM)'
     *          required: false
     *          schema:
     *            type: string
     *          example: 'FE,IOS'
     *        - name: type
     *          in: query
     *          description: '모집 구분(1 : 프로젝트, 2: 스터디)'
     *          required: false
     *          schema:
     *            type: string
     *          example: '1'
     *        - name: period
     *          in: query
     *          description: '조회 기간(일). 14일 경우 14일 이내의 글만 조회'
     *          required: false
     *          schema:
     *            type: string
     *          example: 14
     *        - name: isClosed
     *          in: query
     *          description: '마감여부(true, false)'
     *          required: false
     *          schema:
     *            type: string
     *          example: true
     *        - name: search
     *          in: query
     *          description: '검색'
     *          required: false
     *          schema:
     *            type: string
     *          example: '토이프로젝트'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Post'
     */
    route.get('/pagination', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, page, previousPage, lastId, sort, language, period, isClosed, type, position, search, PostServiceInstance, posts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.query, page = _a.page, previousPage = _a.previousPage, lastId = _a.lastId, sort = _a.sort, language = _a.language, period = _a.period, isClosed = _a.isClosed, type = _a.type, position = _a.position, search = _a.search;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.findPostPagination(page, previousPage, lastId, sort, language, period, isClosed, type, position, search)];
                case 1:
                    posts = _b.sent();
                    return [2 /*return*/, res.status(200).json(posts)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /posts/last-page:
     *    get:
     *      tags:
     *        - posts
     *      summary: 총 페이지 수 구하기
     *      description: 마지막 페이지를 구한다.
     *      parameters:
     *        - name: language
     *          in: query
     *          description: 사용 언어
     *          required: false
     *          schema:
     *            type: string
     *          example: 'react,java'
     *        - name: position
     *          in: query
     *          description: '직군(FE: 프론트엔드, BE: 백엔드, DE: 디자이너, IOS: IOS, AND: 안드로이드, DEVOPS: DevOps, PM)'
     *          required: false
     *          schema:
     *            type: string
     *          example: 'FE,IOS'
     *        - name: type
     *          in: query
     *          description: '모집 구분(1 : 프로젝트, 2: 스터디)'
     *          required: false
     *          schema:
     *            type: string
     *          example: '1'
     *        - name: period
     *          in: query
     *          description: '조회 기간(일). 14일 경우 14일 이내의 글만 조회'
     *          required: false
     *          schema:
     *            type: string
     *          example: 14
     *        - name: isClosed
     *          in: query
     *          description: '마감여부(true, false)'
     *          required: false
     *          schema:
     *            type: string
     *          example: true
     *        - name: search
     *          in: query
     *          description: '검색'
     *          required: false
     *          schema:
     *            type: string
     *          example: '토이프로젝트'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  lastPage:
     *                    type: number
     *                    description : '전체 페이지 수'
     *                    example: 7
     */
    route.get('/last-page', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, language, period, isClosed, type, position, search, PostServiceInstance, lastPage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.query, language = _a.language, period = _a.period, isClosed = _a.isClosed, type = _a.type, position = _a.position, search = _a.search;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.findLastPage(language, period, isClosed, type, position, search)];
                case 1:
                    lastPage = _b.sent();
                    return [2 /*return*/, res.status(200).json({
                            lastPage: lastPage
                        })];
            }
        });
    }); }));
    // 메인에서의 글 추천(미사용, 제거예정)
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
    /**
     * @swagger
     * paths:
     *   /posts/{id}/recommend:
     *    get:
     *      tags:
     *        - posts
     *      summary: 글 상세에서 관련 글 추천
     *      description: '사용자가 읽고 있는 글과 관련된 글을 추천한다. 같은 기술 스택인 글 / 조회수 순으로 정렬 / 사용자가 작성한 글을 제외하기 위해 access token 사용'
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: false
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 글 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Post'
     *        404:
     *          description: Post not found
     */
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
    /**
     * @swagger
     * paths:
     *   /posts/{id}:
     *    get:
     *      tags:
     *        - posts
     *      summary: 글 상세 보기
     *      description: '글 상세 정보를 조회한다. 읽은 목록 추가를 위해 access token을 사용한다.'
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: false
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 글 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Post'
     *        404:
     *          description: Post not found
     */
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
    /**
     * @swagger
     * paths:
     *   /posts:
     *    post:
     *      tags:
     *        - posts
     *      summary: 글 등록
     *      description: '신규 글을 등록한다.'
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: true
     *          schema:
     *            type: string
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Post'
     *      responses:
     *        201:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Post'
     *        400:
     *          description: Invaild post data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
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
    /**
     * @swagger
     * paths:
     *   /posts/{id}:
     *    patch:
     *      tags:
     *        - posts
     *      summary: 글 수정
     *      description: 글을 수정한다.
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: true
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 글 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Post'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Post'
     *        400:
     *          description: Invaild post data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    route.patch('/:id', index_1.isAccessTokenValid, index_1.checkPost, index_1.isPostValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, tokenUserId, tokenType, postDTO, PostServiceInstance, post;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    _a = req.user, tokenUserId = _a._id, tokenType = _a.tokenType;
                    postDTO = req.body;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.modifyPost(mongoose_1.Types.ObjectId(id), tokenUserId, tokenType, postDTO)];
                case 1:
                    post = _b.sent();
                    return [2 /*return*/, res.status(200).json(post)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /posts/{id}:
     *    delete:
     *      tags:
     *        - posts
     *      summary: 글 삭제
     *      description: 글을 삭제한다.
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 글 Id
     *          required: true
     *          example: '60213d1c3126991a7cd1d287'
     *          schema:
     *            type: string
     *      responses:
     *        204:
     *          description: successful operation
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     *        404:
     *          description: Post not found
     */
    route.delete('/:id', index_1.isPostIdValid, index_1.isAccessTokenValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, tokenUserId, tokenType, PostServiceInstance;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    _a = req.user, tokenUserId = _a._id, tokenType = _a.tokenType;
                    PostServiceInstance = new index_2.PostService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, PostServiceInstance.deletePost(mongoose_1.Types.ObjectId(id), tokenUserId, tokenType)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, res.status(204).json()];
            }
        });
    }); }));
    /**
     * @swagger
     * tags:
          - name: likes
            description: 글 관심 등록
     */
    /**
     * @swagger
     * paths:
     *   /posts/likes:
     *    post:
     *      tags:
     *        - likes
     *      summary: 좋아요 등록
     *      description: 좋아요 등록
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: true
     *          schema:
     *            type: string
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                postId:
     *                  type: string
     *                  description : '글 ID'
     *                  example: '61063af4ed4b420bbcfa0b4c'
     *      responses:
     *        201:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  likeUsers:
     *                    type: array
     *                    description: 사용자 리스트
     *                    items:
     *                      type: string
     *        400:
     *          description: Invaild post data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
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
    /**
     * @swagger
     * paths:
     *   /posts/likes/{id}:
     *    delete:
     *      tags:
     *        - likes
     *      summary: 좋아요 삭제
     *      description: 좋아요 삭제
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: true
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 글 Id
     *          required: true
     *          example: '60213d1c3126991a7cd1d287'
     *          schema:
     *            type: string
     *      responses:
     *        204:
     *          description: successful operation
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     *        404:
     *          description: Post not found
     */
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
    /**
     * @swagger
     * paths:
     *   /posts/{id}/isLiked:
     *    get:
     *      tags:
     *        - likes
     *      summary: 사용자의 글 관심 등록 여부
     *      description: '사용자가 글에 관심 등록을 눌렀는지 여부를 조회한다. 사용자 정보는 access token을 이용해 확인한다.'
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: false
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 글 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  isLiked:
     *                    type: boolean
     *                    description : 'true, false'
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
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
    /**
     * @swagger
     * paths:
     *   /posts/{id}/likes:
     *    get:
     *      tags:
     *        - likes
     *      summary: 글의 관심 등록한 사용자 리스트 조회
     *      description: '사용자가 글에 관심 등록한 사용자 리스트를 조회한다.'
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 글 Id
     *          required: true
     *          example: '61063af4ed4b420bbcfa0b4c'
     *          schema:
     *            type: string
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  likeUsers:
     *                    type: array
     *                    description: 사용자 리스트
     *                    items:
     *                      type: string
     */
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
});
//# sourceMappingURL=post.js.map