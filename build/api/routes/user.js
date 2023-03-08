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
var isStringEmpty_1 = require("../../utills/isStringEmpty");
var User_1 = require("../../models/User");
var index_1 = require("../../services/index");
var index_2 = require("../middlewares/index");
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var Post_1 = require("../../models/Post");
var Notification_1 = require("../../models/Notification");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /**
     * @swagger
     * tags:
          - name: users
            description: 사용자에 관련된 API
     */
    app.use('/users', route);
    // s3 pre-sign url 발급
    route.post('/sign', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var fileName, UserServiceInstance, signedUrlPut;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = req.body.fileName;
                    UserServiceInstance = new index_1.UserService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, UserServiceInstance.getPreSignUrl(fileName)];
                case 1:
                    signedUrlPut = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            preSignUrl: signedUrlPut,
                        })];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /users:
     *    get:
     *      tags:
     *        - users
     *      summary: 사용자 조회
     *      description: 닉네임으로 사용자 정보를 조회한다.
     *      parameters:
     *        - name: nickName
     *          in: query
     *          description: 닉네임
     *          required: true
     *          schema:
     *            type: string
     *          example: 'hola!'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/User'
     *        404:
     *          description: parameter is incorrect
     */
    route.get('/', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var nickName, UserServiceInstance, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nickName = req.query.nickName;
                    if (!(0, isStringEmpty_1.isString)(nickName)) {
                        return [2 /*return*/, res.status(400).json({
                                message: "parameter is incorrect",
                            })];
                    }
                    UserServiceInstance = new index_1.UserService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, UserServiceInstance.findByNickName(nickName)];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /users/{id}:
     *    get:
     *      tags:
     *        - users
     *      summary: 사용자 상세 정보 조회
     *      description: '사용자의 상세 정보를 조회한다.'
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 사용자 Id
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
     *                  $ref: '#/components/schemas/User'
     *        404:
     *          description: User not found
     */
    route.get('/:id', index_2.isUserIdValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, UserServiceInstance, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    UserServiceInstance = new index_1.UserService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, UserServiceInstance.findById(mongoose_1.Types.ObjectId(id))];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
    //
    /**
     * @swagger
     * paths:
     *   /users/{id}:
     *    patch:
     *      tags:
     *        - users
     *      summary: 사용자 정보 수정
     *      description: 사용자 정보를 수정한다.
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: true
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 사용자 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/User'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  _id:
     *                    type: string
     *                    description: 사용자 ID
     *                    example: '61063af4ed4b420bbcfa0b4c'
     *                  nickName:
     *                    type: string
     *                    description: 닉네임
     *                    example: 'hola!'
     *                  image:
     *                    type: string
     *                    description: 사용자 이미지 명
     *                    example: 'default.PNG'
     *                  accessToken:
     *                    type: string
     *                    description: access token
     *                  isExists:
     *                    type: boolean
     *                    description: 닉네임 중복 여부
     *                    example: false
     *        400:
     *          description: Nickname is duplicated.
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  isExists:
     *                    type: boolean
     *                    description : 닉네임 중복 여부
     *                    example: true
     *                  message:
     *                    type: string
     *                    example: 'Nickname is duplicated.'
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     *        404:
     *          description: User not found
     */
    route.patch('/:id', index_2.isUserIdValid, index_2.isAccessTokenValid, index_2.nickNameDuplicationCheck, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, tokenUserId, userDTO, UserServiceInstance, _a, userRecord, accessToken, refreshToken;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    tokenUserId = req.user._id;
                    userDTO = req.body;
                    UserServiceInstance = new index_1.UserService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, UserServiceInstance.modifyUser(mongoose_1.Types.ObjectId(id), tokenUserId, userDTO)];
                case 1:
                    _a = _b.sent(), userRecord = _a.userRecord, accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                    res.cookie('R_AUTH', refreshToken, {
                        sameSite: 'none',
                        httpOnly: true,
                        secure: true,
                        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
                    });
                    return [2 /*return*/, res.status(200).json({
                            _id: userRecord._id,
                            nickName: userRecord.nickName,
                            image: userRecord.image,
                            accessToken: accessToken,
                            isExists: false,
                        })];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /users/{id}/exists:
     *    get:
     *      tags:
     *        - users
     *      summary: 사용자 닉네임 중복 체크
     *      description: 사용자 닉네임 중복 체크
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 사용자 Id
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
     *                  isExists:
     *                    type: boolean
     *                    description : '닉네임 중복 여부(true: 중복)'
     *                    example: isExists
     *        400:
     *          description: Nickname is duplicated.
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  isExists:
     *                    type: boolean
     *                    description : '닉네임 중복 여부(true: 중복)'
     *                    example: true
     */
    route.get('/:id/exists', index_2.nickNameDuplicationCheck, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, res.status(200).json({
                    isExists: false,
                })];
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /users/{id}:
     *    delete:
     *      tags:
     *        - users
     *      summary: 회원 탈퇴
     *      description: 사용자 정보 삭제
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: true
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 사용자 Id
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
     *          description: User not found
     */
    route.delete('/:id', index_2.isUserIdValid, index_2.isAccessTokenValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, tokenUserId, UserServiceInstance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    tokenUserId = req.user._id;
                    UserServiceInstance = new index_1.UserService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, UserServiceInstance.deleteUser(mongoose_1.Types.ObjectId(id), tokenUserId)];
                case 1:
                    _a.sent();
                    res.clearCookie('R_AUTH');
                    return [2 /*return*/, res.status(204).json()];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /users/likes/{id}:
     *    get:
     *      tags:
     *        - users
     *      summary: 사용자 관심 등록 리스트 조회
     *      description: '관심 등록한 글들을 조회한다.'
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 사용자 Id
     *          required: true
     *          example: '61fa3f1fea134800135696b4'
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
     *          description: User not found
     */
    route.get('/likes/:id', index_2.isUserIdValid, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, UserServiceInstance, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    UserServiceInstance = new index_1.UserService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, UserServiceInstance.findUserLikes(mongoose_1.Types.ObjectId(id))];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); });
    /**
     * @swagger
     * paths:
     *   /users/read-list/{id}:
     *    get:
     *      tags:
     *        - users
     *      summary: 사용자 읽은 목록  조회
     *      description: '읽은 글들을 조회한다.'
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 사용자 Id
     *          required: true
     *          example: '61fa3f1fea134800135696b4'
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
     *          description: User not found
     */
    route.get('/read-list/:id', index_2.isUserIdValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, UserServiceInstance, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    UserServiceInstance = new index_1.UserService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, UserServiceInstance.findReadList(mongoose_1.Types.ObjectId(id))];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /users/myPosts/{id}:
     *    get:
     *      tags:
     *        - users
     *      summary: 사용자 작성 글 목록 조회
     *      description: '내가 작성한 글들을 조회한다.'
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 사용자 Id
     *          required: true
     *          example: '610e8f2b6eb2018aceda978e'
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
     *          description: User not found
     */
    route.get('/myPosts/:id', index_2.isUserIdValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, UserServiceInstance, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    UserServiceInstance = new index_1.UserService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, UserServiceInstance.findMyPosts(mongoose_1.Types.ObjectId(id))];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
});
//# sourceMappingURL=user.js.map