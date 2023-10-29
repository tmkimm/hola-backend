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
exports.User = void 0;
var mongoose_1 = require("mongoose");
var jwt_1 = require("../utills/jwt");
var Notification_1 = require("./Notification");
var Post_1 = require("./Post");
var UrlSchema = new mongoose_1.Schema({ urlType: String, url: String });
var userSchema = new mongoose_1.Schema({
    idToken: { type: String, required: true },
    tokenType: { type: String, required: true },
    email: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        maxlength: 50,
    },
    nickName: {
        type: String,
        maxlength: 100,
    },
    password: {
        type: String,
        minlength: 8,
    },
    image: String,
    likeLanguages: [String],
    likePosts: [{ type: mongoose_1.Types.ObjectId, ref: 'Post' }],
    readList: [{ type: mongoose_1.Types.ObjectId, ref: 'Post' }],
    position: { type: String, default: '' },
    introduce: { type: String, default: '' },
    workExperience: { type: String, default: '' },
    organizationName: { type: String, default: '' },
    organizationIsOpen: { type: Boolean, default: false },
    urls: [UrlSchema],
}, {
    timestamps: true,
});
userSchema.post('findOneAndDelete', function (user) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 사용자가 작성한 글 제거
                return [4 /*yield*/, Post_1.Post.deleteMany({ author: user._id })];
                case 1:
                    // 사용자가 작성한 글 제거
                    _a.sent();
                    // 사용자가 작성한 댓글 제거
                    return [4 /*yield*/, Post_1.Post.findOneAndUpdate({ comments: { $elemMatch: { author: user._id } } }, { $pull: { comments: { author: user._id } } })];
                case 2:
                    // 사용자가 작성한 댓글 제거
                    _a.sent();
                    // 사용자가 작성한 대댓글 제거
                    return [4 /*yield*/, Post_1.Post.findOneAndUpdate({ 'comments.replies': { $elemMatch: { author: user._id } } }, { $pull: { 'comments.$.replies': { author: user._id } } })];
                case 3:
                    // 사용자가 작성한 대댓글 제거
                    _a.sent();
                    // 회원 탈퇴 시 관련 알림 제거
                    return [4 /*yield*/, Notification_1.Notification.deleteNotificationByUser(user._id)];
                case 4:
                    // 회원 탈퇴 시 관련 알림 제거
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
userSchema.statics.modifyUser = function (id, user) {
    return __awaiter(this, void 0, void 0, function () {
        var userRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findByIdAndUpdate(id, user, {
                        new: true,
                    })];
                case 1:
                    userRecord = _a.sent();
                    return [2 /*return*/, userRecord];
            }
        });
    });
};
userSchema.statics.findByIdToken = function (idToken) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ idToken: idToken })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
userSchema.statics.findByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ email: email })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
userSchema.statics.findByNickName = function (nickName) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ nickName: nickName })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
userSchema.methods.generateAccessToken = function () {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, jwt_1.signJWT)({ nickName: this.nickName, idToken: this.idToken, _id: this._id }, '1h')];
                case 1:
                    accessToken = _a.sent();
                    return [2 /*return*/, accessToken];
            }
        });
    });
};
userSchema.methods.generateRefreshToken = function () {
    return __awaiter(this, void 0, void 0, function () {
        var refreshToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, jwt_1.signJWT)({ nickName: this.nickName }, '2w')];
                case 1:
                    refreshToken = _a.sent();
                    return [2 /*return*/, refreshToken];
            }
        });
    });
};
userSchema.statics.addReadList = function (postId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var isPostExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ _id: userId, readList: postId })];
                case 1:
                    isPostExists = _a.sent();
                    if (!!isPostExists) return [3 /*break*/, 3];
                    return [4 /*yield*/, this.findByIdAndUpdate({ _id: userId }, {
                            $push: {
                                readList: {
                                    _id: postId,
                                },
                            },
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
};
var User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
//# sourceMappingURL=User.js.map