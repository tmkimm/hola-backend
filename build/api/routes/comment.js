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
var mongoose_1 = require("mongoose");
var express_1 = require("express");
var isPostIdValid_1 = require("../middlewares/isPostIdValid");
var index_1 = require("../middlewares/index");
var index_2 = require("../../services/index");
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var Post_1 = require("../../models/Post");
var Notification_1 = require("../../models/Notification");
var CustomError_1 = __importDefault(require("../../CustomError"));
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /**
   * @swagger
   * tags:
        - name: comments
          description: 댓글에 관련된 API
   */
    /*
      # POST /posts/comments : 신규 댓글 등록
      # PATCH /posts/comments/:id : 댓글 정보 수정
      # DELETE /posts/comments/:id : 댓글 삭제
      */
    app.use('/posts/comments', route);
    // 댓글 리스트 조회
    /**
     * @swagger
     * paths:
     *   /posts/comments/{id}:
     *    get:
     *      tags:
     *        - comments
     *      summary: 댓글 리스트 조회
     *      description: 글의 댓글 리스트를 조회한다.
     *      parameters:
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
     *                  $ref: '#/components/schemas/Comment'
     */
    route.get('/:id', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, CommentServiceInstance, comments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
                        throw new CustomError_1.default('InvalidApiError', 400, 'Invalid Api Parameter');
                    }
                    CommentServiceInstance = new index_2.CommentService(Post_1.Post, Notification_1.Notification);
                    return [4 /*yield*/, CommentServiceInstance.findComments(mongoose_1.Types.ObjectId(id))];
                case 1:
                    comments = _a.sent();
                    return [2 /*return*/, res.status(200).json(comments)];
            }
        });
    }); }));
    route.post('/', index_1.isAccessTokenValid, isPostIdValid_1.isPostIdValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, postId, content, nickName, userId, CommentServiceInstance, post;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, postId = _a.postId, content = _a.content;
                    nickName = req.body.nickName;
                    userId = req.user._id;
                    if (!nickName)
                        nickName = "\uC0AC\uC6A9\uC790";
                    CommentServiceInstance = new index_2.CommentService(Post_1.Post, Notification_1.Notification);
                    return [4 /*yield*/, CommentServiceInstance.registerComment(userId, postId, content, nickName)];
                case 1:
                    post = _b.sent();
                    return [2 /*return*/, res.status(201).json(post)];
            }
        });
    }); }));
    // 댓글 수정
    route.patch('/:id', index_1.isAccessTokenValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var commentDTO, _a, tokenUserId, tokenType, CommentServiceInstance, comment;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    commentDTO = req.body;
                    commentDTO._id = req.params.id;
                    _a = req.user, tokenUserId = _a._id, tokenType = _a.tokenType;
                    CommentServiceInstance = new index_2.CommentService(Post_1.Post, Notification_1.Notification);
                    return [4 /*yield*/, CommentServiceInstance.modifyComment(commentDTO, tokenUserId, tokenType)];
                case 1:
                    comment = _b.sent();
                    return [2 /*return*/, res.status(200).json(comment)];
            }
        });
    }); }));
    // 댓글 삭제
    route.delete('/:id', index_1.isAccessTokenValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var commentId, _a, userId, tokenType, CommentServiceInstance;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    commentId = req.params.id;
                    _a = req.user, userId = _a._id, tokenType = _a.tokenType;
                    CommentServiceInstance = new index_2.CommentService(Post_1.Post, Notification_1.Notification);
                    return [4 /*yield*/, CommentServiceInstance.deleteComment(mongoose_1.Types.ObjectId(commentId), userId, tokenType)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, res.status(204).json()];
            }
        });
    }); }));
});
//# sourceMappingURL=comment.js.map