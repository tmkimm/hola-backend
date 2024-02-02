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
exports.EventService = void 0;
var CustomError_1 = __importDefault(require("../CustomError"));
var timeForEndDate_1 = require("../utills/timeForEndDate");
var isNumber_1 = require("./../utills/isNumber");
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var config_1 = __importDefault(require("../config"));
var LikeEvents_1 = require("../models/LikeEvents");
var EventService = /** @class */ (function () {
    function EventService(eventModel, adverisementModel) {
        this.eventModel = eventModel;
        this.adverisementModel = adverisementModel;
    }
    // 리스트뷰 조회
    EventService.prototype.findEventList = function (page, sort, eventType, search, onOffLine, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventModel.findEventPagination(page, sort, eventType, search, onOffLine)];
                    case 1:
                        result = _a.sent();
                        result = this.addPostVirtualField(result, userId);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // Pagination을 위해 마지막 페이지를 구한다.
    EventService.prototype.findEventLastPage = function (eventType, search, onOffLine) {
        return __awaiter(this, void 0, void 0, function () {
            var itemsPerPage, count, lastPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        itemsPerPage = 4 * 5;
                        return [4 /*yield*/, this.eventModel.countEvent(eventType, search, onOffLine)];
                    case 1:
                        count = _a.sent();
                        lastPage = Math.ceil(count / itemsPerPage);
                        return [2 /*return*/, lastPage];
                }
            });
        });
    };
    // 캘린더뷰 조회
    EventService.prototype.findEventListInCalendar = function (year, month, eventType, search, userId, onOffLine) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, isNumber_1.isNumber)(year) || !(0, isNumber_1.isNumber)(month))
                            throw new CustomError_1.default('IllegalArgumentError', 400, 'Date format is incorrect');
                        return [4 /*yield*/, this.eventModel.findEventCalendar(Number(year), Number(month), eventType, search, onOffLine)];
                    case 1:
                        result = _a.sent();
                        result = this.addPostVirtualField(result, userId);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // 진행중인 모든 공모전 조회(SelectBox 전용)
    EventService.prototype.findEventTitleForSelectBox = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventModel.findEventForSelectBox(80)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // mongoose virtual field 추가
    // mongodb text search를 위해 aggregate 사용 시 virtual field가 조회되지 않음 > 수동 추가
    // isLiked : 사용자의 관심 등록 여부
    EventService.prototype.addPostVirtualField = function (events, userId) {
        var result = [];
        // 글 상태
        result = events.map(function (event) {
            var isLiked = false;
            // add isLiked
            if (userId != null && event.likes && event.likes.length > 0) {
                // ObjectId 특성 상 IndexOf를 사용할 수 없어 loop로 비교(리팩토링 필요)
                for (var _i = 0, _a = event.likes; _i < _a.length; _i++) {
                    var likeUserId = _a[_i];
                    if (likeUserId.toString() == userId.toString()) {
                        isLiked = true;
                        break;
                    }
                }
            }
            event.isLiked = isLiked;
            return event;
        });
        return result;
    };
    // 공모전 상세 조회
    EventService.prototype.findEvent = function (eventId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var event, isLiked, _i, _a, likeUserId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.eventModel.findById(eventId).lean()];
                    case 1:
                        event = _b.sent();
                        isLiked = false;
                        // add isLiked
                        if (userId != null && event.likes && event.likes.length > 0) {
                            // ObjectId 특성 상 IndexOf를 사용할 수 없어 loop로 비교(리팩토링 필요)
                            for (_i = 0, _a = event.likes; _i < _a.length; _i++) {
                                likeUserId = _a[_i];
                                if (likeUserId.toString() == userId.toString()) {
                                    isLiked = true;
                                    break;
                                }
                            }
                        }
                        event.isLiked = isLiked;
                        if (!event)
                            throw new CustomError_1.default('NotFoundError', 404, 'Event not found');
                        return [4 /*yield*/, this.increaseView(eventId)];
                    case 2:
                        _b.sent(); // 조회수 증가
                        return [2 /*return*/, event];
                }
            });
        });
    };
    // 추천 이벤트
    EventService.prototype.findRecommendEventList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeADInEvent, adEventList, notInEventId, events, today, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adverisementModel.findActiveADListInEvent()];
                    case 1:
                        activeADInEvent = _a.sent();
                        adEventList = activeADInEvent
                            .filter(function (i) {
                            return i.event && i.event.length > 0 && i.event[0] !== null && i.event[0] !== undefined;
                        })
                            .map(function (i) {
                            i.event[0].isAd = true;
                            return i.event[0];
                        });
                        notInEventId = adEventList.map(function (event) {
                            return event._id;
                        });
                        return [4 /*yield*/, this.eventModel.findRecommendEventList(notInEventId)];
                    case 2:
                        events = _a.sent();
                        adEventList.push.apply(adEventList, events);
                        today = new Date();
                        result = adEventList.map(function (event) {
                            if (!event.isAd || event.isAd !== true)
                                event.isAd = false;
                            event.badge = [];
                            if (event.endDate > today) {
                                event.badge.push({
                                    type: 'deadline',
                                    name: "".concat((0, timeForEndDate_1.timeForEndDate)(event.endDate)),
                                });
                            }
                            return event;
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // 글 상세에서 추천 이벤트 조회
    EventService.prototype.findRecommendEventListInDetail = function (eventId, eventType) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventModel.findRandomEventByEventType(eventId, eventType)];
                    case 1:
                        event = _a.sent();
                        return [2 /*return*/, event];
                }
            });
        });
    };
    // 조회수 증가
    EventService.prototype.increaseView = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventModel.increaseView(eventId)];
                    case 1:
                        _a.sent(); // 조회수 증가
                        return [2 /*return*/];
                }
            });
        });
    };
    // 공모전 등록
    EventService.prototype.createEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var image, eventRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        image = event.imageUrl;
                        event.smallImageUrl = image.replace('event-original', 'event-thumbnail'); // 이미지 등록 시 Lambda에서 thumbnail 이미지 생성
                        return [4 /*yield*/, this.eventModel.create(event)];
                    case 1:
                        eventRecord = _a.sent();
                        return [2 /*return*/, eventRecord];
                }
            });
        });
    };
    // 공모전 수정
    EventService.prototype.modifyEvent = function (id, event) {
        return __awaiter(this, void 0, void 0, function () {
            var eventRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventModel.modifyEvent(id, event)];
                    case 1:
                        eventRecord = _a.sent();
                        return [2 /*return*/, eventRecord];
                }
            });
        });
    };
    // 공모전 삭제
    EventService.prototype.deleteEvent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // TODO 공모전 권한 관리
                    // if (id.toString() !== tokenEventId.toString())
                    //   throw new CustomError('NotAuthenticatedError', 401, 'Event does not match');
                    return [4 /*yield*/, this.eventModel.deleteEvent(id)];
                    case 1:
                        // TODO 공모전 권한 관리
                        // if (id.toString() !== tokenEventId.toString())
                        //   throw new CustomError('NotAuthenticatedError', 401, 'Event does not match');
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // S3 Pre-Sign Url을 발급한다.
    EventService.prototype.getPreSignUrl = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, params, signedUrlPut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fileName) {
                            throw new CustomError_1.default('NotFoundError', 404, '"fileName" does not exist');
                        }
                        s3 = new aws_sdk_1.default.S3({
                            accessKeyId: config_1.default.S3AccessKeyId,
                            secretAccessKey: config_1.default.S3SecretAccessKey,
                            region: config_1.default.S3BucketRegion,
                        });
                        params = {
                            Bucket: config_1.default.S3BucketName,
                            Key: "event-original/".concat(fileName),
                            Expires: 60 * 10, // seconds
                        };
                        return [4 /*yield*/, s3.getSignedUrlPromise('putObject', params)];
                    case 1:
                        signedUrlPut = _a.sent();
                        return [2 /*return*/, signedUrlPut];
                }
            });
        });
    };
    // 관심 등록 추가
    EventService.prototype.addLike = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, event, isLikeExist;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.eventModel.addLike(postId, userId)];
                    case 1:
                        _a = _b.sent(), event = _a.event, isLikeExist = _a.isLikeExist;
                        if (!!isLikeExist) return [3 /*break*/, 3];
                        return [4 /*yield*/, LikeEvents_1.LikeEvents.add(postId, userId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, event];
                }
            });
        });
    };
    // 관심 등록 취소(삭제)
    EventService.prototype.deleteLike = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, event, isLikeExist;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.eventModel.deleteLike(postId, userId)];
                    case 1:
                        _a = _b.sent(), event = _a.event, isLikeExist = _a.isLikeExist;
                        if (!isLikeExist) return [3 /*break*/, 3];
                        return [4 /*yield*/, LikeEvents_1.LikeEvents.delete(postId, userId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, event];
                }
            });
        });
    };
    EventService.prototype.updateClosedAfterEndDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventModel.updateClosedAfterEndDate()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return EventService;
}());
exports.EventService = EventService;
//# sourceMappingURL=event.js.map