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
exports.Advertisement = void 0;
var mongoose_1 = require("mongoose");
var advertisementSchema = new mongoose_1.Schema({
    campaignId: { type: mongoose_1.Types.ObjectId, ref: 'Campaign', required: true },
    advertisementType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    realEndDate: { type: Date, required: false },
    advertisementStatus: { type: String, default: 'active' },
    link: { type: String, required: true },
    linkOpenType: { type: String, defulat: 'blank' },
    imageUrl: { type: String, required: false },
    smallImageUrl: { type: String, required: false },
    mainCopy: { type: String, required: false },
    subCopy: { type: String, required: false },
    bannerSequence: { type: Number, default: 999 },
    views: { type: Number, default: 0 },
    eventId: { type: mongoose_1.Types.ObjectId, ref: 'Event', required: false }, // 이벤트 Id(공모전 광고)
}, {
    timestamps: true,
});
// 광고 상세 조회
advertisementSchema.statics.findAdvertisement = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findById(id).populate('eventId', 'title').lean()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
advertisementSchema.statics.findAdvertisementByEventId = function (eventId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.find({ eventId: eventId })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
advertisementSchema.statics.findAdvertisementByType = function (campaignId, advertisementType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.find({ campaignId: campaignId, advertisementType: advertisementType })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
// 진행중인 공모전 광고 조회
advertisementSchema.statics.findActiveADListInEvent = function () {
    return __awaiter(this, void 0, void 0, function () {
        var adEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.aggregate([
                        { $match: { advertisementType: 'event', advertisementStatus: 'active' } },
                        { $sample: { size: 2 } },
                        {
                            $lookup: {
                                from: 'events',
                                localField: 'eventId',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            title: 1,
                                            eventType: 1,
                                            imageUrl: 1,
                                            smallImageUrl: 1,
                                            startDate: 1,
                                            endDate: 1,
                                            views: 1,
                                            place: 1,
                                            organization: 1,
                                        },
                                    },
                                ],
                                as: 'event',
                            },
                        },
                        {
                            $project: { event: 1 },
                        },
                    ])];
                case 1:
                    adEvent = _a.sent();
                    return [2 /*return*/, adEvent];
            }
        });
    });
};
// 진행중인 배너 광고 조회
advertisementSchema.statics.findActiveBanner = function (bannerType) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.find({ advertisementType: bannerType, advertisementStatus: 'active' })
                        .sort('+bannerSequence')
                        .select('link linkOpenType imageUrl smallImageUrl mainCopy subCopy bannerSequence startDate endDate')];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
advertisementSchema.statics.modifyAdvertisement = function (id, advertisement) {
    return __awaiter(this, void 0, void 0, function () {
        var advertisementRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findByIdAndUpdate(id, advertisement, {
                        new: true,
                    })];
                case 1:
                    advertisementRecord = _a.sent();
                    return [2 /*return*/, advertisementRecord];
            }
        });
    });
};
advertisementSchema.statics.deleteAdvertisement = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findByIdAndDelete(id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// 캠페인의 광고 리스트 조회
advertisementSchema.statics.findAdvertisementInCampaign = function (campaignId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.find({ campaignId: campaignId }).select("advertisementType startDate endDate advertisementStatus")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
// 광고 진행 기간이 지난글 자동 마감
advertisementSchema.statics.updateClosedAfterEndDate = function () {
    return __awaiter(this, void 0, void 0, function () {
        var today;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    today = new Date();
                    return [4 /*yield*/, this.updateMany({ $and: [{ advertisementStatus: 'active' }, { endDate: { $lte: today } }] }, { advertisementStatus: 'close' })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var Advertisement = (0, mongoose_1.model)('Advertisement', advertisementSchema);
exports.Advertisement = Advertisement;
//# sourceMappingURL=Advertisement.js.map