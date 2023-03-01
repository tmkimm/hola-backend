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
exports.DashboardService = void 0;
var User_1 = require("../models/User");
var Post_1 = require("../models/Post");
var SignOutUser_1 = require("../models/SignOutUser");
var PostFilterLog_1 = require("../models/PostFilterLog");
var DashboardService = /** @class */ (function () {
    function DashboardService() {
    }
    // 데일리 액션) 현재 총 회원 수, 오늘 가입자, 오늘 탈퇴자
    DashboardService.prototype.findDailyUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalUser, today, signUp, signOut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.User.countDocuments()];
                    case 1:
                        totalUser = _a.sent();
                        today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return [4 /*yield*/, User_1.User.countDocuments({ createdAt: { $gte: today } })];
                    case 2:
                        signUp = _a.sent();
                        return [4 /*yield*/, SignOutUser_1.SignOutUser.countDocuments({ signOutDate: { $gte: today } })];
                    case 3:
                        signOut = _a.sent();
                        return [2 /*return*/, {
                                totalUser: totalUser,
                                signUp: signUp,
                                signOut: signOut,
                            }];
                }
            });
        });
    };
    // 일자별 회원 가입 현황(일자 / 신규 가입자 / 탈퇴자)
    DashboardService.prototype.findUserHistory = function (startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var userHistory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.User.aggregate([
                            { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, signIn: { $sum: 1 } } },
                            { $addFields: { signOut: 0 } },
                            {
                                $unionWith: {
                                    coll: 'signoutusers',
                                    pipeline: [
                                        { $match: { signOutDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                                        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$signOutDate' } }, signOut: { $sum: 1 } } },
                                        { $addFields: { signIn: 0 } },
                                    ],
                                },
                            },
                            { $group: { _id: '$_id', signIn: { $sum: '$signIn' }, signOut: { $sum: '$signOut' } } },
                            { $sort: { _id: 1 } },
                        ])];
                    case 1:
                        userHistory = _a.sent();
                        return [2 /*return*/, userHistory];
                }
            });
        });
    };
    // 게시글 데일리(오늘 전체 글 조회 수, 등록된 글, 글 마감 수, 글 삭제 수 )
    DashboardService.prototype.findDailyPost = function () {
        return __awaiter(this, void 0, void 0, function () {
            var today, totalView, totalViewSum, created, closed, deleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = new Date();
                        today.setHours(0, 0, 0, 0);
                        totalView = 0;
                        return [4 /*yield*/, Post_1.Post.aggregate([
                                { $match: { createdAt: { $gte: today } } },
                                { $group: { _id: null, totalView: { $sum: '$views' } } },
                            ])];
                    case 1:
                        totalViewSum = _a.sent();
                        if (totalViewSum && totalViewSum.length > 0 && totalViewSum[0].totalView)
                            totalView = totalViewSum[0].totalView;
                        return [4 /*yield*/, Post_1.Post.countDocuments({ createdAt: { $gte: today } })];
                    case 2:
                        created = _a.sent();
                        return [4 /*yield*/, Post_1.Post.countDocuments({ closeDate: { $gte: today } })];
                    case 3:
                        closed = _a.sent();
                        return [4 /*yield*/, Post_1.Post.countDocuments({ deleteDate: { $gte: today } })];
                    case 4:
                        deleted = _a.sent();
                        return [2 /*return*/, {
                                totalView: totalView,
                                created: created,
                                closed: closed,
                                deleted: deleted,
                            }];
                }
            });
        });
    };
    // 일자별 게시글 현황(일자 / 등록된 글 / 마감된 글 / 삭제된 글)
    DashboardService.prototype.findPostHistory = function (startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var postHistory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Post_1.Post.aggregate([
                            { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, created: { $sum: 1 } } },
                            {
                                $unionWith: {
                                    coll: 'posts',
                                    pipeline: [
                                        { $match: { closeDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                                        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$closeDate' } }, closed: { $sum: 1 } } },
                                    ],
                                },
                            },
                            {
                                $unionWith: {
                                    coll: 'posts',
                                    pipeline: [
                                        { $match: { deleteDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                                        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$deleteDate' } }, deleted: { $sum: 1 } } },
                                    ],
                                },
                            },
                            {
                                $group: {
                                    _id: '$_id',
                                    created: { $sum: '$created' },
                                    closed: { $sum: '$closed' },
                                    deleted: { $sum: '$deleted' },
                                },
                            },
                            { $sort: { _id: 1 } },
                        ])];
                    case 1:
                        postHistory = _a.sent();
                        return [2 /*return*/, postHistory];
                }
            });
        });
    };
    // 가장 많이 조회해 본 언어 필터
    DashboardService.prototype.findPostFilterRank = function (startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var userHistory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PostFilterLog_1.PostFilterLog.aggregate([
                            { $match: { viewDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                            { $project: { _id: 0, viewDate: 1, language: 1 } },
                            { $unwind: '$language' },
                            { $group: { _id: '$language', count: { $sum: 1 } } },
                            { $sort: { count: -1 } },
                        ])];
                    case 1:
                        userHistory = _a.sent();
                        return [2 /*return*/, userHistory];
                }
            });
        });
    };
    return DashboardService;
}());
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.js.map