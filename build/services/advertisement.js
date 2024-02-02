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
exports.AdvertisementService = void 0;
var CustomError_1 = __importDefault(require("../CustomError"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var config_1 = __importDefault(require("../config"));
var AdvertisementService = /** @class */ (function () {
    function AdvertisementService(advertisementModel) {
        this.advertisementModel = advertisementModel;
    }
    // 진행중인 배너 광고 조회
    AdvertisementService.prototype.findActiveBanner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var advertisement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.advertisementModel.findActiveBanner('banner')];
                    case 1:
                        advertisement = _a.sent();
                        return [2 /*return*/, advertisement];
                }
            });
        });
    };
    // 진행중인 공모전 광고 조회
    AdvertisementService.prototype.findActiveEventBanner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var advertisement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.advertisementModel.findActiveBanner('eventBanner')];
                    case 1:
                        advertisement = _a.sent();
                        return [2 /*return*/, advertisement];
                }
            });
        });
    };
    // 광고 상세 조회
    AdvertisementService.prototype.findAdvertisement = function (advertisementId) {
        return __awaiter(this, void 0, void 0, function () {
            var advertisement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.advertisementModel.findAdvertisement(advertisementId)];
                    case 1:
                        advertisement = _a.sent();
                        if (!advertisement)
                            throw new CustomError_1.default('NotFoundError', 404, 'Advertisement not found');
                        if (advertisement.advertisementType === "event" &&
                            advertisement.eventId &&
                            advertisement.eventId._id &&
                            advertisement.eventId.title)
                            return [2 /*return*/, __assign(__assign({}, advertisement), { eventId: advertisement.eventId._id, eventTitle: advertisement.eventId.title })];
                        else
                            return [2 /*return*/, advertisement];
                        return [2 /*return*/];
                }
            });
        });
    };
    // 광고 등록
    AdvertisementService.prototype.createAdvertisement = function (advertisement) {
        return __awaiter(this, void 0, void 0, function () {
            var advertisementRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.advertisementModel.create(advertisement)];
                    case 1:
                        advertisementRecord = _a.sent();
                        return [2 /*return*/, advertisementRecord];
                }
            });
        });
    };
    // 광고 수정
    AdvertisementService.prototype.modifyAdvertisement = function (id, advertisement) {
        return __awaiter(this, void 0, void 0, function () {
            var advertisementRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.advertisementModel.modifyAdvertisement(id, advertisement)];
                    case 1:
                        advertisementRecord = _a.sent();
                        return [2 /*return*/, advertisementRecord];
                }
            });
        });
    };
    // 광고 삭제
    AdvertisementService.prototype.deleteAdvertisement = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.advertisementModel.deleteAdvertisement(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 광고 자동 마감
    AdvertisementService.prototype.updateClosedAfterEndDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.advertisementModel.updateClosedAfterEndDate()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // S3 Pre-Sign Url을 발급한다.
    AdvertisementService.prototype.getPreSignUrl = function (fileName) {
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
                            Key: "ad/".concat(fileName),
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
    return AdvertisementService;
}());
exports.AdvertisementService = AdvertisementService;
//# sourceMappingURL=advertisement.js.map