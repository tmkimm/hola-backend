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
exports.Notification = void 0;
var mongoose_1 = require("mongoose");
var notificationSchema = new mongoose_1.Schema({
    targetUserId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    generateUserId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    generateObjectId: { type: mongoose_1.Types.ObjectId },
    postId: { type: mongoose_1.Types.ObjectId, ref: 'Post' },
    readAt: Date,
    isRead: { type: Boolean, default: false },
    noticeCode: String,
    noticeType: String,
}, {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});
// 내 알림 조회
notificationSchema.statics.findMyNotifications = function (targetUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, unReadCount, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    limit = 5;
                    return [4 /*yield*/, this.countDocuments({ targetUserId: targetUserId, isRead: false })];
                case 1:
                    unReadCount = _a.sent();
                    if (unReadCount >= 6)
                        limit = unReadCount;
                    return [4 /*yield*/, this.find({ targetUserId: targetUserId })
                            .populate('generateUserId', 'nickName')
                            .populate({ path: 'postId', match: { isDeleted: false }, select: 'title' })
                            .sort('+isRead -createdAt')
                            .limit(limit)
                            .lean()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
// 읽지 않은 알림 수 조회
notificationSchema.statics.findUnReadCount = function (targetUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var unReadCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.countDocuments({ targetUserId: targetUserId, isRead: false })];
                case 1:
                    unReadCount = _a.sent();
                    return [2 /*return*/, unReadCount];
            }
        });
    });
};
// 신규 알림 등록
// like : 좋아요, comment : 댓글, reply: 대댓글
notificationSchema.statics.registerNotification = function (postId, targetUserId, generateUserId, noticeType, generateObjectId) {
    return __awaiter(this, void 0, void 0, function () {
        var isNoticeExist, noticeCode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ postId: postId, generateObjectId: generateObjectId })];
                case 1:
                    isNoticeExist = _a.sent();
                    if (!(!isNoticeExist && targetUserId !== generateUserId)) return [3 /*break*/, 3];
                    switch (noticeType) {
                        case 'like':
                            noticeCode = '0';
                            break;
                        case 'comment':
                            noticeCode = '1';
                            break;
                        case 'reply':
                            noticeCode = '2';
                            break;
                        default:
                            noticeCode = '0';
                            break;
                    }
                    // const noticeCode = noticeType === 'like' ? '0' : noticeType === 'comment' ? '1' : noticeType === 'reply' ? '2' : '';
                    return [4 /*yield*/, this.create({ targetUserId: targetUserId, generateUserId: generateUserId, postId: postId, noticeCode: noticeCode, noticeType: noticeType, generateObjectId: generateObjectId })];
                case 2:
                    // const noticeCode = noticeType === 'like' ? '0' : noticeType === 'comment' ? '1' : noticeType === 'reply' ? '2' : '';
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
};
// 알림 삭제
notificationSchema.statics.deleteNotification = function (generateObjectId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.deleteMany({ generateObjectId: generateObjectId })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// 글 삭제 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByPost = function (postId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.deleteMany({ postId: postId })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// 회원 탈퇴 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByUser = function (userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.deleteMany({ $or: [{ targetUserId: userId }, { generateUserId: userId }] })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// 알림 읽음 처리
notificationSchema.statics.updateReadAt = function (postId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.updateMany({
                        postId: postId,
                        targetUserId: userId,
                        readAt: undefined,
                    }, {
                        readAt: new Date(),
                        isRead: true,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var Notification = (0, mongoose_1.model)('Notification', notificationSchema);
exports.Notification = Notification;
//# sourceMappingURL=Notification.js.map