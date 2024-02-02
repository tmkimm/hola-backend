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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
var mongoose_1 = require("mongoose");
var isNumber_1 = require("../utills/isNumber");
var eventSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    eventType: { type: String, required: true },
    onlineOrOffline: { type: String, required: true },
    place: { type: String, required: true },
    organization: { type: String, required: true },
    link: { type: String, required: true },
    imageUrl: { type: String, required: true },
    smallImageUrl: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    applicationStartDate: { type: Date, required: true },
    applicationEndDate: { type: Date, required: true },
    closeDate: { type: Date, required: false },
    author: { type: mongoose_1.Types.ObjectId, ref: 'User', required: false },
    isDeleted: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    likes: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }],
    description: { type: String, default: null },
    isFree: { type: Boolean, default: false },
    price: { type: Number, default: null }, // 금액
}, {
    timestamps: true,
});
eventSchema.statics.modifyEvent = function (id, event) {
    return __awaiter(this, void 0, void 0, function () {
        var eventRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findByIdAndUpdate(id, event, {
                        new: true,
                    })];
                case 1:
                    eventRecord = _a.sent();
                    return [2 /*return*/, eventRecord];
            }
        });
    });
};
eventSchema.statics.deleteEvent = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOneAndUpdate({ _id: id }, { isDeleted: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// 조회 query 생성
// eventType : 공모전 구분(conference, hackathon, contest, bootcamp, others)
// onOffLine : 진행방식(온라인/오프라인)
// isClosed  : 마감여부(null : 전체 조회, false : 마감되지 않은 자료만 조회, true : 마감된 자료만 조회)
var makeFindEventQuery = function (eventType, onOffLine, isClosed) {
    // Query
    var query = {};
    if (typeof onOffLine === 'string' && onOffLine && onOffLine.toUpperCase() != 'ALL')
        query.onlineOrOffline = onOffLine;
    if (isClosed != null)
        query.isClosed = { $eq: isClosed };
    query.isDeleted = { $eq: false };
    // 공모전 구분(conference, hackathon, contest, bootcamp, others)
    if (typeof eventType === 'string' && eventType && eventType.toUpperCase() != 'ALL') {
        query.eventType = { $eq: eventType };
    }
    return query;
};
// 최신, 트레딩 조회
eventSchema.statics.findEventPagination = function (page, sort, eventType, search, onOffLine) {
    return __awaiter(this, void 0, void 0, function () {
        var sortQuery, sortableColumns_1, query, itemsPerPage, pageToSkip, aggregateSearch, aggregate, events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sortQuery = [];
                    // Sorting
                    if (sort) {
                        sortableColumns_1 = ['views', 'createdAt'];
                        sortQuery = sort.split(',').filter(function (value) {
                            return sortableColumns_1.indexOf(value.substr(1, value.length)) !== -1 || sortableColumns_1.indexOf(value) !== -1;
                        });
                        sortQuery.push('-createdAt');
                    }
                    else {
                        sortQuery.push('-createdAt');
                    }
                    query = makeFindEventQuery(eventType, onOffLine, null);
                    itemsPerPage = 4 * 5;
                    pageToSkip = 0;
                    if ((0, isNumber_1.isNumber)(page) && Number(page) > 0)
                        pageToSkip = (Number(page) - 1) * itemsPerPage;
                    aggregateSearch = [];
                    if (search && typeof search === 'string') {
                        aggregateSearch.push({
                            $search: {
                                index: 'events_text_search',
                                text: {
                                    query: search,
                                    path: {
                                        wildcard: '*',
                                    },
                                },
                            },
                        });
                    }
                    aggregate = __spreadArray(__spreadArray([], aggregateSearch, true), [{ $match: query }], false);
                    return [4 /*yield*/, this.aggregate(aggregate).sort(sortQuery.join(' ')).skip(pageToSkip).limit(Number(itemsPerPage))];
                case 1:
                    events = _a.sent();
                    return [2 /*return*/, events];
            }
        });
    });
};
// 공모전 캘린더뷰 조회
eventSchema.statics.findEventCalendar = function (year, month, eventType, search, onOffLine) {
    return __awaiter(this, void 0, void 0, function () {
        var query, firstDay, lastDay, aggregateSearch, aggregate, events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = makeFindEventQuery(eventType, onOffLine, null);
                    firstDay = new Date(year, month - 1, 1);
                    lastDay = new Date(year, month);
                    query.startDate = { $gte: firstDay, $lte: lastDay };
                    aggregateSearch = [];
                    if (search && typeof search === 'string') {
                        aggregateSearch.push({
                            $search: {
                                index: 'events_text_search',
                                text: {
                                    query: search,
                                    path: {
                                        wildcard: '*',
                                    },
                                },
                            },
                        });
                    }
                    aggregate = __spreadArray(__spreadArray([], aggregateSearch, true), [{ $match: query }], false);
                    return [4 /*yield*/, this.aggregate(aggregate).sort('startDate')];
                case 1:
                    events = _a.sent();
                    return [2 /*return*/, events];
            }
        });
    });
};
// 총 Page 수 계산
eventSchema.statics.countEvent = function (eventType, onOffLine, search) {
    return __awaiter(this, void 0, void 0, function () {
        var query, aggregateSearch, aggregate, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = makeFindEventQuery(eventType, onOffLine, null);
                    aggregateSearch = [];
                    if (search && typeof search === 'string') {
                        aggregateSearch.push({
                            $search: {
                                index: 'events_text_search',
                                text: {
                                    query: search,
                                    path: {
                                        wildcard: '*',
                                    },
                                },
                            },
                        });
                    }
                    aggregate = __spreadArray(__spreadArray([], aggregateSearch, true), [
                        { $match: query },
                        {
                            $project: {
                                title: 1,
                                score: { $meta: 'searchScore' },
                            },
                        },
                    ], false);
                    aggregate.push({
                        $count: 'eventCount',
                    });
                    return [4 /*yield*/, this.aggregate(aggregate)];
                case 1:
                    result = _a.sent();
                    if (result && result.length > 0)
                        return [2 /*return*/, result[0].eventCount];
                    else
                        return [2 /*return*/, 0];
                    return [2 /*return*/];
            }
        });
    });
};
// 조회수 증가
eventSchema.statics.increaseView = function (eventId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findByIdAndUpdate(eventId, {
                        $inc: {
                            views: 1,
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// 이벤트 목록 select box
eventSchema.statics.findEventForSelectBox = function (limit) {
    return __awaiter(this, void 0, void 0, function () {
        var query, events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = makeFindEventQuery(null, null, false);
                    return [4 /*yield*/, this.find(query).select('_id title').sort('-createdAt').limit(limit)];
                case 1:
                    events = _a.sent();
                    return [2 /*return*/, events];
            }
        });
    });
};
// 추천 이벤트 조회
// TODO startDate 조건 변경
eventSchema.statics.findRecommendEventList = function (notInEventId) {
    return __awaiter(this, void 0, void 0, function () {
        var query, limit, today, events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = makeFindEventQuery(null, null, false);
                    query._id = { $nin: notInEventId };
                    limit = 10 - notInEventId.length;
                    today = new Date();
                    query.startDate = { $gte: today.setDate(today.getDate() - 180) };
                    return [4 /*yield*/, this.find(query)
                            .select('_id title eventType imageUrl smallImageUrl startDate endDate views place organization')
                            .sort('-views')
                            .limit(limit)
                            .lean()];
                case 1:
                    events = _a.sent();
                    return [2 /*return*/, events];
            }
        });
    });
};
// 랜덤 이벤트 조회(글 상세에서 추천)
eventSchema.statics.findRandomEventByEventType = function (eventId, eventType) {
    return __awaiter(this, void 0, void 0, function () {
        var query, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = makeFindEventQuery(eventType, null, false);
                    query._id = { $ne: eventId }; // 현재 읽고 있는 글 제외
                    return [4 /*yield*/, this.aggregate([{ $match: query }, { $sample: { size: 6 } }])];
                case 1:
                    event = _a.sent();
                    return [2 /*return*/, event];
            }
        });
    });
};
// 관심등록 추가
// 디바운스 실패 경우를 위해 예외처리
eventSchema.statics.addLike = function (eventId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var event, isLikeExist, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.find({ _id: eventId, likes: { $in: [userId] } })];
                case 1:
                    event = _a.sent();
                    isLikeExist = event.length > 0;
                    if (!!isLikeExist) return [3 /*break*/, 3];
                    return [4 /*yield*/, this.findByIdAndUpdate({ _id: eventId }, {
                            $push: {
                                likes: {
                                    _id: userId,
                                },
                            },
                            $inc: {
                                totalLikes: 1,
                            },
                        }, {
                            new: true,
                            upsert: true,
                        })];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    result = event[event.length - 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, { event: result, isLikeExist: isLikeExist }];
            }
        });
    });
};
eventSchema.statics.deleteLike = function (eventId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var events, event, isLikeExist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.find({ _id: eventId })];
                case 1:
                    events = _a.sent();
                    event = events[events.length - 1];
                    isLikeExist = event && event.likes.indexOf(userId) > -1;
                    if (!isLikeExist) return [3 /*break*/, 3];
                    return [4 /*yield*/, this.findOneAndUpdate({ _id: eventId }, {
                            $pull: { likes: userId },
                            $inc: {
                                totalLikes: -1,
                            },
                        }, {
                            new: true,
                        })];
                case 2:
                    event = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, { event: event, isLikeExist: isLikeExist }];
            }
        });
    });
};
// 신청기간이 지난글 자동 마감
eventSchema.statics.updateClosedAfterEndDate = function () {
    return __awaiter(this, void 0, void 0, function () {
        var today;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    today = new Date();
                    return [4 /*yield*/, this.updateMany({ $and: [{ isClosed: false }, { applicationEndDate: { $lte: today } }] }, { isClosed: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var Event = (0, mongoose_1.model)('Event', eventSchema);
exports.Event = Event;
//# sourceMappingURL=Event.js.map