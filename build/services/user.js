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
exports.UserService = void 0;
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var index_1 = __importDefault(require("../config/index"));
var CustomError_1 = __importDefault(require("../CustomError"));
var SignOutUser_1 = require("../models/SignOutUser");
var UserService = /** @class */ (function () {
    function UserService(postModel, userModel, notificationModel) {
        this.postModel = postModel;
        this.userModel = userModel;
        this.notificationModel = notificationModel;
    }
    // 닉네임을 이용하여 사용자 정보를 조회한다.
    UserService.prototype.findByNickName = function (nickName) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userModel.findByNickName(nickName)];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users];
                }
            });
        });
    };
    // id를 이용하여 사용자 정보를 조회한다.
    UserService.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userModel.findById(id)];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users];
                }
            });
        });
    };
    // 사용자 정보를 수정한다.
    // 닉네임을 기준으로 Token을 생성하기 때문에 Token을 재발급한다.
    UserService.prototype.modifyUser = function (id, tokenUserId, user) {
        return __awaiter(this, void 0, void 0, function () {
            var userRecord, _a, accessToken, refreshToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (id.toString() !== tokenUserId.toString())
                            throw new CustomError_1.default('NotAuthenticatedError', 401, 'User does not match');
                        return [4 /*yield*/, this.userModel.modifyUser(id, user)];
                    case 1:
                        userRecord = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                userRecord.generateAccessToken(),
                                userRecord.generateRefreshToken(),
                            ])];
                    case 2:
                        _a = _b.sent(), accessToken = _a[0], refreshToken = _a[1];
                        return [2 /*return*/, { userRecord: userRecord, accessToken: accessToken, refreshToken: refreshToken }];
                }
            });
        });
    };
    // 회원 탈퇴
    UserService.prototype.deleteUser = function (id, tokenUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (id.toString() !== tokenUserId.toString())
                            throw new CustomError_1.default('NotAuthenticatedError', 401, 'User does not match');
                        return [4 /*yield*/, this.userModel.findById(id)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 4];
                        // 탈퇴 유저 이력 생성
                        return [4 /*yield*/, SignOutUser_1.SignOutUser.create({
                                idToken: user.idToken,
                                tokenType: user.tokenType,
                                nickName: user.nickName,
                                signInDate: user.createdAt,
                                signOutDate: new Date(),
                                userId: user._id,
                            })];
                    case 2:
                        // 탈퇴 유저 이력 생성
                        _a.sent();
                        return [4 /*yield*/, this.userModel.findOneAndDelete({ _id: id })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 사용자가 관심 등록한 글 리스트를 조회한다.
    UserService.prototype.findUserLikes = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var userLikes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userModel
                            .findById(id)
                            .populate({
                            path: 'likePosts',
                            match: { isDeleted: false },
                            options: { sort: { createdAt: -1 } },
                        })
                            .select('likePosts')];
                    case 1:
                        userLikes = _a.sent();
                        return [2 /*return*/, userLikes];
                }
            });
        });
    };
    // 사용자의 읽은 목록을 조회한다.
    UserService.prototype.findReadList = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var readList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userModel
                            .findById(id)
                            .populate({
                            path: 'readList',
                            match: { isDeleted: false },
                            options: { sort: { createdAt: -1 } },
                        })
                            .select('readList')];
                    case 1:
                        readList = _a.sent();
                        return [2 /*return*/, readList];
                }
            });
        });
    };
    // 사용자의 작성 목록을 조회한다.
    UserService.prototype.findMyPosts = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var myPosts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postModel
                            .find({ author: id, isDeleted: false })
                            .populate('author', 'nickName image')
                            .sort('-createdAt')];
                    case 1:
                        myPosts = _a.sent();
                        return [2 /*return*/, myPosts];
                }
            });
        });
    };
    // S3 Pre-Sign Url을 발급한다.
    // eslint-disable-next-line class-methods-use-this
    UserService.prototype.getPreSignUrl = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, params, signedUrlPut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3 = new aws_sdk_1.default.S3({
                            accessKeyId: index_1.default.S3AccessKeyId,
                            secretAccessKey: index_1.default.S3SecretAccessKey,
                            region: index_1.default.S3BucketRegion,
                        });
                        params = {
                            Bucket: index_1.default.S3BucketName,
                            Key: fileName,
                            Expires: 60 * 60 * 3,
                        };
                        return [4 /*yield*/, s3.getSignedUrlPromise('putObject', params)];
                    case 1:
                        signedUrlPut = _a.sent();
                        return [2 /*return*/, signedUrlPut];
                }
            });
        });
    };
    // 사용자의 읽은 목록을 추가한다.
    UserService.prototype.addReadLists = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userModel.addReadList(postId, userId)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.js.map