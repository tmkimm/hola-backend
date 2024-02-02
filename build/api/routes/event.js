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
var Event_1 = require("../../models/Event");
var event_1 = require("./../../services/event");
var isEventValid_1 = require("../middlewares/isEventValid");
var isAccessTokenValidWithAdmin_1 = require("../middlewares/isAccessTokenValidWithAdmin");
var isAccessTokenValid_1 = require("../middlewares/isAccessTokenValid");
var isEventIdValid_1 = require("../middlewares/isEventIdValid");
var getUserIdByAccessToken_1 = require("../middlewares/getUserIdByAccessToken");
var checkADIsActive_1 = require("../middlewares/checkADIsActive");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /**
     * @swagger
     * tags:
          - name: events
            description: 공모전에 관련된 API
     */
    app.use('/events', route);
    // #region 공모전 리스트 조회(페이징)
    /**
     * @swagger
     * paths:
     *   /events:
     *    get:
     *      tags:
     *        - 공모전
     *      summary: 공모전 리스트 조회(Pagination)
     *      description: 공모전 리스트를 조회한다.
     *      parameters:
     *        - name: page
     *          in: query
     *          description: 현재 페이지(기본 1)
     *          required: true
     *          schema:
     *            type: number
     *          example: 1
     *        - name: sort
     *          in: query
     *          description: '정렬(최신순: -createdAt, 인기순: -views)'
     *          required: false
     *          schema:
     *            type: string
     *          example: '-createdAt'
     *        - name: eventType
     *          in: query
     *          description: '공모전 구분(conference, hackathon, contest, bootcamp, others)'
     *          required: false
     *          schema:
     *            type: string
     *          example: '1'
     *        - name: search
     *          in: query
     *          description: '검색'
     *          required: false
     *          schema:
     *            type: string
     *          example: '토이프로젝트'
     *        - name: onOffLine
     *          in: query
     *          description: '진행방식(on:온라인, off:오프라인, onOff: 온/오프라인)'
     *          required: false
     *          schema:
     *            type: string
     *          example: 'on'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Event'
     */
    // #endregion
    route.get('/', getUserIdByAccessToken_1.getUserIdByAccessToken, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, page, sort, eventType, search, onOffLine, userId, EventServiceInstance, events;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.query, page = _a.page, sort = _a.sort, eventType = _a.eventType, search = _a.search, onOffLine = _a.onOffLine;
                    userId = req.user._id;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.findEventList(page, sort, eventType, search, onOffLine, userId)];
                case 1:
                    events = _b.sent();
                    return [2 /*return*/, res.status(200).json(events)];
            }
        });
    }); }));
    // #region 공모전 리스트 조회(페이징)
    /**
     * @swagger
     * paths:
     *   /events/last-page:
     *    get:
     *      tags:
     *        - 공모전
     *      summary: 공모전 리스트 조회 - 마지막 페이지 조회
     *      description: Pagination에서 마지막 페이지를 조회한다.
     *      parameters:
     *        - name: eventType
     *          in: query
     *          description: '공모전 구분(conference, hackathon, contest, bootcamp, others)'
     *          required: false
     *          schema:
     *            type: string
     *          example: '1'
     *        - name: search
     *          in: query
     *          description: '검색'
     *          required: false
     *          schema:
     *            type: string
     *          example: '토이프로젝트'
     *        - name: onOffLine
     *          in: query
     *          description: '진행방식(on:온라인, off:오프라인, onOff: 온/오프라인)'
     *          required: false
     *          schema:
     *            type: string
     *          example: 'on'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  lastPage:
     *                    type: number
     *                    description : '전체 페이지 수'
     *                    example: 7
     */
    // #endregion
    route.get('/last-page', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, eventType, search, onOffLine, EventServiceInstance, lastPage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.query, eventType = _a.eventType, search = _a.search, onOffLine = _a.onOffLine;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.findEventLastPage(eventType, search, onOffLine)];
                case 1:
                    lastPage = _b.sent();
                    return [2 /*return*/, res.status(200).json({ lastPage: lastPage })];
            }
        });
    }); }));
    // #region 공모전 캘린더뷰 조회
    /**
     * @swagger
     * paths:
     *   /events/calendar/{year}/{month}:
     *    get:
     *      tags:
     *        - 공모전
     *      summary: 공모전 캘린더뷰 조회
     *      description: 공모전 캘린더뷰를 조회한다.
     *      parameters:
     *        - name: year
     *          in: path
     *          description: 년도
     *          required: true
     *          schema:
     *            type: number
     *          example: 2023
     *        - name: month
     *          in: path
     *          description: 달
     *          required: true
     *          schema:
     *            type: string
     *          example: 09
     *        - name: eventType
     *          in: query
     *          description: '공모전 구분(conference, hackathon, contest, bootcamp, others)'
     *          required: false
     *          schema:
     *            type: string
     *          example: '1'
     *        - name: search
     *          in: query
     *          description: '검색'
     *          required: false
     *          schema:
     *            type: string
     *          example: '토이프로젝트'
     *        - name: onOffLine
     *          in: query
     *          description: '진행방식(on:온라인, off:오프라인, onOff: 온/오프라인)'
     *          required: false
     *          schema:
     *            type: string
     *          example: 'on'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Event'
     */
    // #endregion
    route.get('/calendar/:year/:month', getUserIdByAccessToken_1.getUserIdByAccessToken, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, year, month, _b, eventType, search, onOffLine, userId, EventServiceInstance, events;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.params, year = _a.year, month = _a.month;
                    _b = req.query, eventType = _b.eventType, search = _b.search, onOffLine = _b.onOffLine;
                    userId = req.user._id;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.findEventListInCalendar(year, month, eventType, search, userId, onOffLine)];
                case 1:
                    events = _c.sent();
                    return [2 /*return*/, res.status(200).json(events)];
            }
        });
    }); }));
    // #region 진행중인 모든 공모전 조회(SelectBox 전용)
    /**
     * @swagger
     * paths:
     *   /events/bulk:
     *    get:
     *      tags:
     *        - 공모전
     *      summary: 진행중인 모든 공모전 조회(SelectBox 전용)
     *      description: 진행중인 모든 공모전 조회한다.(80개)
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Event'
     */
    // #endregion
    route.get('/bulk', getUserIdByAccessToken_1.getUserIdByAccessToken, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var EventServiceInstance, events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.findEventTitleForSelectBox()];
                case 1:
                    events = _a.sent();
                    return [2 /*return*/, res.status(200).json(events)];
            }
        });
    }); }));
    // #region 추천 공모전
    /**
     * @swagger
     * paths:
     *   /events/recommend:
     *    get:
     *      tags:
     *        - 공모전
     *      summary: 추천 공모전 조회(AD)
     *      description: 추천 공모전을 조회한다.
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/RecommendedEvent'
     */
    // #endregion
    route.get('/recommend', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var EventServiceInstance, events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.findRecommendEventList()];
                case 1:
                    events = _a.sent();
                    return [2 /*return*/, res.status(200).json(events)];
            }
        });
    }); }));
    // #region 공모전 이미지 S3 Pre-Signed URL 발급
    /**
     * @swagger
     * paths:
     *   /events/pre-sign-url:
     *    get:
     *      tags:
     *        - 공모전
     *      summary: 공모전 이미지 S3 Pre-Signed URL 발급
     *      description: 공모전 이미지 S3 Pre-Signed URL 발급
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
        var fileName, EventServiceInstance, signedUrlPut;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = req.query.fileName;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.getPreSignUrl(fileName)];
                case 1:
                    signedUrlPut = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            preSignUrl: signedUrlPut,
                        })];
            }
        });
    }); }));
    // #region 공모전 상세 보기
    /**
     * @swagger
     * paths:
     *   /events/{id}:
     *    get:
     *      tags:
     *        - 공모전
     *      summary: 공모전 상세 보기
     *      description: '공모전 상세 정보를 조회한다.'
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 공모전 Id
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
     *                $ref: '#/components/schemas/Event'
     *        404:
     *          description: Event not found
     */
    // #endregion
    route.get('/:id', getUserIdByAccessToken_1.getUserIdByAccessToken, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var eventId, userId, EventServiceInstance, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventId = req.params.id;
                    userId = req.user._id;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.findEvent(mongoose_1.Types.ObjectId(eventId), userId)];
                case 1:
                    event = _a.sent();
                    return [2 /*return*/, res.status(200).json(event)];
            }
        });
    }); }));
    // #region 공모전 상세에서 관련 공모전 추천
    /**
     * @swagger
     * paths:
     *   /events/{id}/recommend:
     *    get:
     *      tags:
     *        - 공모전
     *      summary: 공모전 상세에서 관련 공모전 추천
     *      description: '현재 읽고 있는 공모전 유형과 같은 글을 추천한다.'
     *      parameters:
     *        - name: id
     *          in: path
     *          description: 공모전 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *        - name: eventType
     *          in: query
     *          description: 공모전 구분(conference, hackathon, contest, bootcamp, others)
     *          required: true
     *          schema:
     *            type: string
     *          example: 'conference'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Event'
     *        404:
     *          description: Event not found
     */
    // #endregion
    route.get('/:id/recommend', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var eventId, eventType, EventServiceInstance, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventId = req.params.id;
                    eventType = req.query.eventType;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.findRecommendEventListInDetail(mongoose_1.Types.ObjectId(eventId), eventType)];
                case 1:
                    event = _a.sent();
                    return [2 /*return*/, res.status(200).json(event)];
            }
        });
    }); }));
    // #region POST - 공모전 등록
    /**
     * @swagger
     * paths:
     *   /events:
     *    post:
     *      tags:
     *        - 공모전
     *      summary: 공모전 등록
     *      description: '신규 공모전를 등록한다.'
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
     *              $ref: '#/components/schemas/PostEvent'
     *      responses:
     *        201:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Event'
     *        400:
     *          description: Invaild event data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    // #endregion
    route.post('/', isAccessTokenValidWithAdmin_1.isAccessTokenValidWithAdmin, isEventValid_1.checkEvent, isEventValid_1.isEventValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var eventDTO, EventServiceInstance, event_2, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        eventDTO = req.body;
                        EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                        return [4 /*yield*/, EventServiceInstance.createEvent(eventDTO)];
                    case 1:
                        event_2 = _a.sent();
                        return [2 /*return*/, res.status(201).json(event_2)];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                errors: [
                                    {
                                        location: 'body',
                                        param: 'name',
                                        error: 'TypeError',
                                        message: 'Invalid request',
                                    },
                                ],
                                error: error_1,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }));
    // #region 공모전 수정
    /**
     * @swagger
     * paths:
     *   /events/{id}:
     *    put:
     *      tags:
     *        - 공모전
     *      summary: 공모전 수정
     *      description: 공모전를 수정한다.
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: false
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 공모전 Id
     *          required: true
     *          example: '635a91e837ad67001412321a'
     *          schema:
     *            type: string
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Event'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Event'
     *        400:
     *          description: Invaild event data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    // #endregion
    route.put('/:id', isAccessTokenValidWithAdmin_1.isAccessTokenValidWithAdmin, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, eventDTO, EventServiceInstance, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    eventDTO = req.body;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.modifyEvent(mongoose_1.Types.ObjectId(id), eventDTO)];
                case 1:
                    event = _a.sent();
                    return [2 /*return*/, res.status(200).json(event)];
            }
        });
    }); }));
    // #region 공모전 삭제
    /**
     * @swagger
     * paths:
     *   /events/{id}:
     *    delete:
     *      tags:
     *        - 공모전
     *      summary: 공모전 삭제
     *      description: 공모전를 삭제한다.
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: false
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 공모전 Id
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
     *          description: Event not found
     */
    // #endregion
    route.delete('/:id', isAccessTokenValidWithAdmin_1.isAccessTokenValidWithAdmin, checkADIsActive_1.checkADIsActive, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, EventServiceInstance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.deleteEvent(mongoose_1.Types.ObjectId(id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res.status(204).json()];
            }
        });
    }); }));
    /**
     * @swagger
     * tags:
          - name: likes
            description: 공모전 관심 등록
     */
    // #region 좋아요 등록
    /**
     * @swagger
     * paths:
     *   /events/likes:
     *    post:
     *      tags:
     *        - 공모전 관심등록
     *      summary: 좋아요 등록
     *      description: 좋아요 등록
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: true
     *          schema:
     *            type: string
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                eventId:
     *                  type: string
     *                  description : '글 ID'
     *                  example: '61063af4ed4b420bbcfa0b4c'
     *      responses:
     *        201:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  likeUsers:
     *                    type: array
     *                    description: 사용자 리스트
     *                    items:
     *                      type: string
     *        400:
     *          description: Invaild post data
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    // #endregion
    route.post('/likes', isAccessTokenValid_1.isAccessTokenValid, isEventIdValid_1.isEventIdValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var eventId, userId, EventServiceInstance, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventId = req.body.eventId;
                    userId = req.user._id;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.addLike(mongoose_1.Types.ObjectId(eventId), userId)];
                case 1:
                    event = _a.sent();
                    return [2 /*return*/, res.status(201).json({ likeUsers: event.likes })];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /events/likes/{id}:
     *    delete:
     *      tags:
     *        - 공모전 관심등록
     *      summary: 공모전 좋아요 삭제
     *      description: 좋아요 삭제
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: true
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 글 Id
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
     *          description: Event not found
     */
    route.delete('/likes/:id', isAccessTokenValid_1.isAccessTokenValid, isEventIdValid_1.isEventIdValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var eventId, userId, EventServiceInstance, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    eventId = req.params.id;
                    userId = req.user._id;
                    EventServiceInstance = new event_1.EventService(Event_1.Event, Advertisement_1.Advertisement);
                    return [4 /*yield*/, EventServiceInstance.deleteLike(mongoose_1.Types.ObjectId(eventId), userId)];
                case 1:
                    event = _a.sent();
                    return [2 /*return*/, res.status(201).json({ likeUsers: event.likes })];
            }
        });
    }); }));
});
//# sourceMappingURL=event.js.map