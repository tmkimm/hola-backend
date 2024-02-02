"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.CampaignService = void 0;
var mongoose_1 = require("mongoose");
var CustomError_1 = __importDefault(require("../CustomError"));
var CampaignService = /** @class */ (function () {
    function CampaignService(campaignModel, advertisementModel, advertisementLogModel) {
        this.campaignModel = campaignModel;
        this.advertisementModel = advertisementModel;
        this.advertisementLogModel = advertisementLogModel;
    }
    // 캠페인 리스트 조회
    CampaignService.prototype.findCampaignList = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignModel.findCampaignListInPagination(page)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // 캠페인 상세 조회
    CampaignService.prototype.findCampaign = function (campaignId) {
        return __awaiter(this, void 0, void 0, function () {
            var campaign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignModel.findCampaign(campaignId)];
                    case 1:
                        campaign = _a.sent();
                        if (!campaign)
                            throw new CustomError_1.default('NotFoundError', 404, 'Campaign not found');
                        return [2 /*return*/, campaign];
                }
            });
        });
    };
    // 캠페인 등록
    CampaignService.prototype.createCampaign = function (campaign) {
        return __awaiter(this, void 0, void 0, function () {
            var campaignRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignModel.create(campaign)];
                    case 1:
                        campaignRecord = _a.sent();
                        return [2 /*return*/, campaignRecord];
                }
            });
        });
    };
    // 캠페인 수정
    CampaignService.prototype.modifyCampaign = function (id, campaign) {
        return __awaiter(this, void 0, void 0, function () {
            var campaignRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignModel.modifyCampaign(id, campaign)];
                    case 1:
                        campaignRecord = _a.sent();
                        return [2 /*return*/, campaignRecord];
                }
            });
        });
    };
    // 캠페인 삭제
    CampaignService.prototype.deleteCampaign = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.campaignModel.deleteCampaign(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 캠페인의 광고 리스트 조회
    CampaignService.prototype.findAdvertisementInCampaign = function (campaignId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.advertisementModel.findAdvertisementInCampaign(campaignId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // 광고 결과 집계
    CampaignService.prototype.findCampaignResult = function (campaignId) {
        return __awaiter(this, void 0, void 0, function () {
            var campaign, adList, adIdList, aggregate, logAggregate, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findCampaign(campaignId)];
                    case 1:
                        campaign = _a.sent();
                        return [4 /*yield*/, this.advertisementModel.findAdvertisementInCampaign(campaignId)];
                    case 2:
                        adList = _a.sent();
                        adIdList = adList.map(function (ad) {
                            return mongoose_1.Types.ObjectId(ad._id);
                        });
                        return [4 /*yield*/, this.advertisementLogModel.findADResult(adIdList)];
                    case 3:
                        aggregate = _a.sent();
                        logAggregate = aggregate.map(function (ad) {
                            return {
                                _id: ad._id.advertisementId,
                                logType: ad._id.logType,
                                count: ad.count,
                                advertisementType: ad.advertisements.advertisementType,
                            };
                        });
                        result = [];
                        logAggregate.forEach(function (element) {
                            var _a, _b;
                            var index = result.findIndex(function (v) { return (v.advertisementType === element.advertisementType ? true : false); });
                            if (index === -1) {
                                result.push((_a = {
                                        advertisementType: element.advertisementType,
                                        advertisementId: element._id
                                    },
                                    _a[element.logType] = element.count,
                                    _a));
                            }
                            else {
                                result[index] = __assign(__assign({}, result[index]), (_b = {}, _b[element.logType] = element.count, _b));
                            }
                        });
                        // 전환비용, 클릭률 세팅
                        result = result.map(function (v) {
                            if (!v.reach || !v.impression)
                                return v;
                            var reachRate = ((v.reach / v.impression) * 100).toFixed(2) + '%';
                            var reachPrice = (campaign.conversionCost * v.reach).toFixed(0);
                            return __assign(__assign({}, v), { reachRate: reachRate, reachPrice: reachPrice });
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return CampaignService;
}());
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.js.map