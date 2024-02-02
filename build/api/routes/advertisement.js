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
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var Advertisement_1 = require("../../models/Advertisement");
var AdvertisementLog_1 = require("../../models/AdvertisementLog");
var advertisement_1 = require("../../services/advertisement");
var CustomError_1 = __importDefault(require("../../CustomError"));
var advertisementLog_1 = require("../../services/advertisementLog");
var isAccessTokenValidWithAdmin_1 = require("../middlewares/isAccessTokenValidWithAdmin");
var checkADTypeDuplication_1 = require("../middlewares/checkADTypeDuplication");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /**
     * @swagger
     * tags:
          - name: advertisements
            description: 광고에 관련된 API
     */
    app.use('/advertisements', route);
    // #region 광고 이미지 S3 Pre-Signed URL 발급
    /**
     * @swagger
     * paths:
     *   /advertisements/pre-sign-url:
     *    get:
     *      tags:
     *        - 광고
     *      summary: 광고 이미지 S3 Pre-Signed URL 발급
     *      description: 광고 이미지 S3 Pre-Signed URL 발급
     *      parameters:
     *        - name: fileName
     *          in: query
     *          description: 파일명
     *          required: true
     *          example: '2839_284_42.jpg'
     *          schema:
     *            type: string
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  preSignUrl:
     *                    type: string
     *                    description: Pre-signed url
     */
    // #endregion
    route.get('/pre-sign-url', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var fileName, AdvertisementServiceInstance, signedUrlPut;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = req.query.fileName;
                    AdvertisementServiceInstance = new advertisement_1.AdvertisementService(Advertisement_1.Advertisement);
                    return [4 /*yield*/, AdvertisementServiceInstance.getPreSignUrl(fileName)];
                case 1:
                    signedUrlPut = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            preSignUrl: signedUrlPut,
                        })];
            }
        });
    }); }));
    // #region POST - 이벤트 추적
    /**
     * @swagger
     * paths:
     *   /advertisements/event-log:
     *    post:
     *      tags:
     *        - 광고
     *      summary: 광고 이벤트 추적 로깅
     *      description: '광고가 노출되었을때 이벤트를 추적한다.'
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                advertisementId:
     *                  type: string
     *                  description: Advertisement ID
     *                  example: 6513fd110c19093e9896c9a2
     *                logType:
     *                  type: string
     *                  description: 로그유형(impression 노출, reach 도달)
     *                  example: impression
     *      responses:
     *        204:
     *          description: successful operation
     */
    // #endregion
    route.post('/event-log', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, advertisementId, logType, AdvertisementLogServiceInstance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, advertisementId = _a.advertisementId, logType = _a.logType;
                        AdvertisementLogServiceInstance = new advertisementLog_1.AdvertisementLogService(AdvertisementLog_1.AdvertisementLog);
                        if (!advertisementId)
                            throw new CustomError_1.default('NotFoundError', 400, '"advertisementId" not found');
                        return [4 /*yield*/, AdvertisementLogServiceInstance.createEventLog(mongoose_1.Types.ObjectId(advertisementId), logType)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, res.status(204).json()];
                }
            });
        });
    }));
    // #region 진행중인 배너 광고 조회
    /**
     * @swagger
     * paths:
     *   /advertisements/banner:
     *    get:
     *      tags:
     *        - 광고
     *      summary: 진행중인 배너 광고 조회
     *      description: '배너를 조회한다.'
     *      parameters:
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Advertisement'
     */
    // #endregion
    route.get('/banner', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var AdvertisementServiceInstance, advertisement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    AdvertisementServiceInstance = new advertisement_1.AdvertisementService(Advertisement_1.Advertisement);
                    return [4 /*yield*/, AdvertisementServiceInstance.findActiveBanner()];
                case 1:
                    advertisement = _a.sent();
                    return [2 /*return*/, res.status(200).json(advertisement)];
            }
        });
    }); }));
    // #region 진행중인 공모전 배너 조회
    /**
     * @swagger
     * paths:
     *   /advertisements/eventBanner:
     *    get:
     *      tags:
     *        - 광고
     *      summary: 진행중인 공모전 배너 조회
     *      description: '공모전 배너를 조회한다.'
     *      parameters:
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Advertisement'
     */
    // #endregion
    route.get('/eventBanner', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var AdvertisementServiceInstance, advertisement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    AdvertisementServiceInstance = new advertisement_1.AdvertisementService(Advertisement_1.Advertisement);
                    return [4 /*yield*/, AdvertisementServiceInstance.findActiveEventBanner()];
                case 1:
                    advertisement = _a.sent();
                    return [2 /*return*/, res.status(200).json(advertisement)];
            }
        });
    }); }));
    // #region 광고 상세 보기
    /**
     * @swagger
     * paths:
     *   /advertisements/{id}:
     *    get:
     *      tags:
     *        - 광고
     *      summary: 광고 상세 보기
     *      description: '광고 상세 정보를 조회한다.'
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: false
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 광고 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Advertisement'
     *        404:
     *          description: Advertisement not found
     */
    // #endregion
    route.get('/:id', isAccessTokenValidWithAdmin_1.isAccessTokenValidWithAdmin, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var advertisementId, AdvertisementServiceInstance, advertisement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    advertisementId = req.params.id;
                    AdvertisementServiceInstance = new advertisement_1.AdvertisementService(Advertisement_1.Advertisement);
                    return [4 /*yield*/, AdvertisementServiceInstance.findAdvertisement(mongoose_1.Types.ObjectId(advertisementId))];
                case 1:
                    advertisement = _a.sent();
                    return [2 /*return*/, res.status(200).json(advertisement)];
            }
        });
    }); }));
    // #region POST - 광고 등록
    /**
     * @swagger
     * paths:
     *   /advertisements:
     *    post:
     *      tags:
     *        - 광고
     *      summary: 광고 등록
     *      description: '신규 광고를 등록한다.'
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: false
     *          schema:
     *            type: string
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Advertisement'
     *      responses:
     *        201:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Advertisement'
     *        400:
     *          description: Invaild advertisement data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    // #endregion
    route.post('/', isAccessTokenValidWithAdmin_1.isAccessTokenValidWithAdmin, checkADTypeDuplication_1.checkADTypeDuplication, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var advertisementDTO, AdvertisementServiceInstance, advertisement, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        advertisementDTO = req.body;
                        AdvertisementServiceInstance = new advertisement_1.AdvertisementService(Advertisement_1.Advertisement);
                        return [4 /*yield*/, AdvertisementServiceInstance.createAdvertisement(advertisementDTO)];
                    case 1:
                        advertisement = _a.sent();
                        return [2 /*return*/, res.status(201).json(advertisement)];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                errors: [
                                    {
                                        location: 'body',
                                        param: 'name',
                                        error: 'TypeError',
                                        message: 'must be String',
                                    },
                                ],
                                error: error_1,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }));
    // #region 광고 수정
    /**
     * @swagger
     * paths:
     *   /advertisements/{id}:
     *    put:
     *      tags:
     *        - 광고
     *      summary: 광고 수정
     *      description: 광고를 수정한다.
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: false
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 광고 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Advertisement'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Advertisement'
     *        400:
     *          description: Invaild advertisement data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    // #endregion
    route.put('/:id', isAccessTokenValidWithAdmin_1.isAccessTokenValidWithAdmin, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, advertisementDTO, AdvertisementServiceInstance, advertisement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    advertisementDTO = req.body;
                    AdvertisementServiceInstance = new advertisement_1.AdvertisementService(Advertisement_1.Advertisement);
                    return [4 /*yield*/, AdvertisementServiceInstance.modifyAdvertisement(mongoose_1.Types.ObjectId(id), advertisementDTO)];
                case 1:
                    advertisement = _a.sent();
                    return [2 /*return*/, res.status(200).json(advertisement)];
            }
        });
    }); }));
    // #region 광고 삭제
    /**
     * @swagger
     * paths:
     *   /advertisements/{id}:
     *    delete:
     *      tags:
     *        - 광고
     *      summary: 광고 삭제
     *      description: 광고를 삭제한다.
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: false
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 광고 Id
     *          required: true
     *          example: '60213d1c3126991a7cd1d287'
     *          schema:
     *            type: string
     *      responses:
     *        204:
     *          description: successful operation
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     *        404:
     *          description: Advertisement not found
     */
    // #endregion
    route.delete('/:id', isAccessTokenValidWithAdmin_1.isAccessTokenValidWithAdmin, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, AdvertisementServiceInstance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    AdvertisementServiceInstance = new advertisement_1.AdvertisementService(Advertisement_1.Advertisement);
                    return [4 /*yield*/, AdvertisementServiceInstance.deleteAdvertisement(mongoose_1.Types.ObjectId(id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res.status(204).json()];
            }
        });
    }); }));
});
//# sourceMappingURL=advertisement.js.map