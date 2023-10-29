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
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var Advertisement_1 = require("../../models/Advertisement");
var Campaign_1 = require("../../models/Campaign");
var campaign_1 = require("../../services/campaign");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /**
     * @swagger
     * tags:
          - name: campaigns
            description: 캠페인에 관련된 API
     */
    app.use('/campaigns', route);
    // #region 캠페인 리스트 조회(페이징)
    /**
     * @swagger
     * paths:
     *   /campaigns:
     *    get:
     *      tags:
     *        - campaigns
     *      summary: 캠페인 리스트 조회(Pagination)
     *      description: 캠페인 리스트를 조회한다.
     *      parameters:
     *        - name: page
     *          in: query
     *          description: 현재 페이지(기본 1)
     *          required: true
     *          schema:
     *            type: number
     *          example: 1
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Campaign'
     */
    // #endregion
    route.get('/', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var page, CampaignServiceInstance, campaigns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = req.query.page;
                    CampaignServiceInstance = new campaign_1.CampaignService(Campaign_1.Campaign, Advertisement_1.Advertisement);
                    return [4 /*yield*/, CampaignServiceInstance.findCampaignList(page)];
                case 1:
                    campaigns = _a.sent();
                    return [2 /*return*/, res.status(200).json(campaigns)];
            }
        });
    }); }));
    // #region 캠페인 상세 보기
    /**
     * @swagger
     * paths:
     *   /campaigns/{id}:
     *    get:
     *      tags:
     *        - campaigns
     *      summary: 캠페인 상세 보기
     *      description: '캠페인 상세 정보를 조회한다.'
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 캠페인 Id
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
     *                $ref: '#/components/schemas/Campaign'
     *        404:
     *          description: Campaign not found
     */
    // #endregion
    route.get('/:id', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var campaignId, CampaignServiceInstance, campaign;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    campaignId = req.params.id;
                    CampaignServiceInstance = new campaign_1.CampaignService(Campaign_1.Campaign, Advertisement_1.Advertisement);
                    return [4 /*yield*/, CampaignServiceInstance.findCampaign(campaignId)];
                case 1:
                    campaign = _a.sent();
                    return [2 /*return*/, res.status(200).json(campaign)];
            }
        });
    }); }));
    // #region 캠페인의 광고 리스트 보기
    /**
     * @swagger
     * paths:
     *   /campaigns/{id}/advertisement:
     *    get:
     *      tags:
     *        - campaigns
     *      summary: 캠페인의 광고 리스트 보기
     *      description: '캠페인의 등록된 광고 리스트를 조회한다.'
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 캠페인 Id
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
     */
    // #endregion
    route.get('/:id/advertisement', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var campaignId, CampaignServiceInstance, campaign;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    campaignId = req.params.id;
                    CampaignServiceInstance = new campaign_1.CampaignService(Campaign_1.Campaign, Advertisement_1.Advertisement);
                    return [4 /*yield*/, CampaignServiceInstance.findAdvertisementInCampaign(campaignId)];
                case 1:
                    campaign = _a.sent();
                    return [2 /*return*/, res.status(200).json(campaign)];
            }
        });
    }); }));
    // #region POST - 캠페인 등록
    /**
     * @swagger
     * paths:
     *   /campaigns:
     *    post:
     *      tags:
     *        - campaigns
     *      summary: 캠페인 등록
     *      description: '신규 캠페인를 등록한다.'
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Campaign'
     *      responses:
     *        201:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Campaign'
     *        400:
     *          description: Invaild campaign data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    // #endregion
    route.post('/', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var campaignDTO, CampaignServiceInstance, campaign, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        campaignDTO = req.body;
                        CampaignServiceInstance = new campaign_1.CampaignService(Campaign_1.Campaign, Advertisement_1.Advertisement);
                        return [4 /*yield*/, CampaignServiceInstance.createCampaign(campaignDTO)];
                    case 1:
                        campaign = _a.sent();
                        return [2 /*return*/, res.status(201).json(campaign)];
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
    // #region 캠페인 수정
    /**
     * @swagger
     * paths:
     *   /campaigns/{id}:
     *    patch:
     *      tags:
     *        - campaigns
     *      summary: 캠페인 수정
     *      description: 캠페인를 수정한다.
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 캠페인 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Campaign'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Campaign'
     *        400:
     *          description: Invaild campaign data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    // #endregion
    route.patch('/:id', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, campaignDTO, CampaignServiceInstance, campaign;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    campaignDTO = req.body;
                    CampaignServiceInstance = new campaign_1.CampaignService(Campaign_1.Campaign, Advertisement_1.Advertisement);
                    return [4 /*yield*/, CampaignServiceInstance.modifyCampaign(mongoose_1.Types.ObjectId(id), campaignDTO)];
                case 1:
                    campaign = _a.sent();
                    return [2 /*return*/, res.status(200).json(campaign)];
            }
        });
    }); }));
    // #region 캠페인 삭제
    /**
     * @swagger
     * paths:
     *   /campaigns/{id}:
     *    delete:
     *      tags:
     *        - campaigns
     *      summary: 캠페인 삭제
     *      description: 캠페인를 삭제한다.
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 캠페인 Id
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
     *          description: Campaign not found
     */
    // #endregion
    route.delete('/:id', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, CampaignServiceInstance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    CampaignServiceInstance = new campaign_1.CampaignService(Campaign_1.Campaign, Advertisement_1.Advertisement);
                    return [4 /*yield*/, CampaignServiceInstance.deleteCampaign(mongoose_1.Types.ObjectId(id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res.status(204).json()];
            }
        });
    }); }));
});
//# sourceMappingURL=campaign.js.map