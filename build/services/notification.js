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
exports.NotificationService = void 0;
var timeForCreatedAt_1 = require("../utills/timeForCreatedAt");
var NotificationService = /** @class */ (function () {
    function NotificationService(notificationModel) {
        this.notificationModel = notificationModel;
    }
    // 알림 리스트를 조회한다.
    NotificationService.prototype.findNotifications = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var notice, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationModel.findNotifications(userId)];
                    case 1:
                        notice = _a.sent();
                        result = notice.map(function (item) {
                            item.timeAgo = (0, timeForCreatedAt_1.timeForCreatedAt)(item.createdAt);
                            return item;
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // 읽지 않은 알림 수를 조회한다.
    NotificationService.prototype.findUnReadCount = function (author) {
        return __awaiter(this, void 0, void 0, function () {
            var notice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationModel.findUnReadCount(author)];
                    case 1:
                        notice = _a.sent();
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    // 알림 읽음 처리
    NotificationService.prototype.readNotification = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationModel.readNotification(_id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 알림 전체 읽음 처리
    NotificationService.prototype.readAll = function (targetUserId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationModel.readAll(targetUserId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 회원 가입 알림
    NotificationService.prototype.createSignUpNotice = function (targetUserId, nickName) {
        return __awaiter(this, void 0, void 0, function () {
            var icon, urn, title, buttonLabel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        icon = "\uD83D\uDC4B";
                        urn = "/setting";
                        title = "".concat(nickName, "\uB2D8 \uBC18\uAC00\uC6CC\uC694 \uD83E\uDD73 \uC62C\uB77C\uC5D0\uC11C \uC6D0\uD558\uB294 \uD300\uC6D0\uC744 \uB9CC\uB098\uBCF4\uC138\uC694 :)");
                        buttonLabel = "\uD504\uB85C\uD544 \uC644\uC131\uD558\uAE30";
                        return [4 /*yield*/, this.notificationModel.createNotification('signup', targetUserId, urn, title, icon, buttonLabel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 댓글 알림
    NotificationService.prototype.createCommentNotice = function (targetUserId, nickName, postId, createUserId, createObjectId, commentContent) {
        return __awaiter(this, void 0, void 0, function () {
            var icon, urn, title, buttonLabel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (targetUserId.toString() === createUserId.toString())
                            return [2 /*return*/];
                        icon = "\uD83D\uDCAC";
                        urn = "/study/".concat(postId.toString());
                        title = "".concat(nickName, "\uC774 \uB313\uAE00\uC744 \uB0A8\uACBC\uC5B4\uC694: ").concat(commentContent);
                        buttonLabel = "\uD655\uC778\uD558\uAE30";
                        return [4 /*yield*/, this.notificationModel.createNotification('comment', targetUserId, urn, title, icon, buttonLabel, createUserId, createObjectId, postId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.modifyCommentContent = function (commentId, nickName, content) {
        return __awaiter(this, void 0, void 0, function () {
            var title;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        title = "".concat(nickName, "\uC774 \uB313\uAE00\uC744 \uB0A8\uACBC\uC5B4\uC694: ").concat(content);
                        return [4 /*yield*/, this.notificationModel.modifyNotificationTitle(commentId, title)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return NotificationService;
}());
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.js.map