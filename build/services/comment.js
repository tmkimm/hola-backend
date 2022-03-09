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
exports.CommentService = void 0;
var CommentService = /** @class */ (function () {
    function CommentService(postModel, notificationModel) {
        this.postModel = postModel;
        this.notificationModel = notificationModel;
        this.postModel = postModel;
        this.notificationModel = notificationModel;
    }
    // 글 id를 이용해 댓글 리스트를 조회한다.
    CommentService.prototype.findComments = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var comments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.findComments(id)];
                    case 1:
                        comments = _a.sent();
                        return [2 /*return*/, comments];
                }
            });
        });
    };
    // 신규 댓글을 추가한다.
    CommentService.prototype.registerComment = function (userID, postId, content) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, post, commentId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.postModel.registerComment(postId, content, userID)];
                    case 1:
                        _a = _b.sent(), post = _a.post, commentId = _a.commentId;
                        return [4 /*yield*/, this.notificationModel.registerNotification(postId, post.author, userID, 'comment', commentId)];
                    case 2:
                        _b.sent(); // 알림 등록
                        return [2 /*return*/, post];
                }
            });
        });
    };
    // 댓글을 수정한다.
    CommentService.prototype.modifyComment = function (comment, tokenUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var commentRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.checkCommentAuthorization(comment._id, tokenUserId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.postModel.modifyComment(comment)];
                    case 2:
                        commentRecord = _a.sent();
                        return [2 /*return*/, commentRecord];
                }
            });
        });
    };
    // 댓글을 삭제한다.
    CommentService.prototype.deleteComment = function (commentId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var postRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel.checkCommentAuthorization(commentId, userId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.postModel.deleteComment(commentId)];
                    case 2:
                        postRecord = _a.sent();
                        return [4 /*yield*/, this.notificationModel.deleteNotification(commentId)];
                    case 3:
                        _a.sent(); // 알림 삭제
                        return [2 /*return*/];
                }
            });
        });
    };
    return CommentService;
}());
exports.CommentService = CommentService;
//# sourceMappingURL=comment.js.map