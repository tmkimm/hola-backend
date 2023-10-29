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
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var index_1 = require("../../services/index");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /**
     * @swagger
     * tags:
          - name: dashboard
          description: 어드민용 대시보드
     */
    app.use('/dashboard', route);
    /**
     * @swagger
     * paths:
     *   /dashboard/users/daily:
     *    get:
     *      tags:
     *        - dashboard
     *      summary: 사용자 데일리 액션
     *      description: 총 회원 수, 오늘 가입자, 오늘 탈퇴자 조회
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  totalUser:
     *                    type: integer
     *                    description: 총 회원 수
     *                  signUp:
     *                    type: integer
     *                    description: 오늘 가입자 수
     *                  signOut:
     *                    type: integer
     *                    description: 오늘 탈퇴자 조회 수
     */
    route.get('/users/daily', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var DashboardServiceInstance, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    DashboardServiceInstance = new index_1.DashboardService();
                    return [4 /*yield*/, DashboardServiceInstance.findDailyUser()];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /dashboard/users/history:
     *    get:
     *      tags:
     *        - dashboard
     *      summary: 일자별 회원 가입 현황
     *      description: 조회 기간에 해당되는 가입자 정보 집계
     *      parameters:
     *        - name: startDate
     *          in: query
     *          description: 조회 시작일
     *          required: true
     *          schema:
     *            type: string
     *            example: '2022-09-01'
     *        - name: endDate
     *          in: query
     *          description: 조회 종료일
     *          required: true
     *          schema:
     *            type: string
     *            example: '2022-09-30'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  type: object
     *                  properties:
     *                    _id:
     *                      type: string
     *                      description: 날짜
     *                    signIn:
     *                      type: integer
     *                      description: 가입자 수
     *                    signOut:
     *                      type: integer
     *                      description: 탈퇴자 수
     *              example:
     *              - _id: '2022-09-01'
     *                signIn: 8
     *                signOut: 3
     */
    route.get('/users/history', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, startDate, endDate, DashboardServiceInstance, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                    DashboardServiceInstance = new index_1.DashboardService();
                    return [4 /*yield*/, DashboardServiceInstance.findUserHistory(startDate, endDate)];
                case 1:
                    user = _b.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /dashboard/posts/daily:
     *    get:
     *      tags:
     *        - dashboard
     *      summary: 게시글 데일리 액션
     *      description: 총오늘 전체 글 조회 수, 등록된 글, 글 마감 수, 글 삭제 수 조회
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  totalView:
     *                    type: integer
     *                    description: 총 조회수
     *                  created:
     *                    type: integer
     *                    description: 등록된 글
     *                  closed:
     *                    type: integer
     *                    description: 마감된 글
     *                  deleted:
     *                    type: integer
     *                    description: 삭제된 글
     */
    route.get('/posts/daily', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var DashboardServiceInstance, post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    DashboardServiceInstance = new index_1.DashboardService();
                    return [4 /*yield*/, DashboardServiceInstance.findDailyPost()];
                case 1:
                    post = _a.sent();
                    return [2 /*return*/, res.status(200).json(post)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /dashboard/posts/history:
     *    get:
     *      tags:
     *        - dashboard
     *      summary: 일자별 게시글 현황
     *      description: 조회 기간에 해당되는 게시글 정보 집계(일자, 등록된 글, 마감된 글, 삭제된 글)
     *      parameters:
     *        - name: startDate
     *          in: query
     *          description: 조회 시작일
     *          required: true
     *          schema:
     *            type: string
     *            example: '2022-09-01'
     *        - name: endDate
     *          in: query
     *          description: 조회 종료일
     *          required: true
     *          schema:
     *            type: string
     *            example: '2022-09-30'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  type: object
     *                  properties:
     *                    _id:
     *                      type: string
     *                      description: 날짜
     *                    created:
     *                      type: integer
     *                      description: 등록된 글
     *                    closed:
     *                      type: integer
     *                      description: 마감된 글
     *                    deleted:
     *                      type: integer
     *                      description: 삭제된 글
     *              example:
     *              - _id: '2022-09-01'
     *                created: 8
     *                closed: 3
     *                deleted: 3
     */
    route.get('/posts/history', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, startDate, endDate, DashboardServiceInstance, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                    DashboardServiceInstance = new index_1.DashboardService();
                    return [4 /*yield*/, DashboardServiceInstance.findPostHistory(startDate, endDate)];
                case 1:
                    user = _b.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /dashboard/posts/filter-rank:
     *    get:
     *      tags:
     *        - dashboard
     *      summary: 가장 많이 조회해 본 언어 필터
     *      description: 조회 기간에 해당되는 언어 필터링 순위
     *      parameters:
     *        - name: startDate
     *          in: query
     *          description: 조회 시작일
     *          required: true
     *          schema:
     *            type: string
     *            example: '2022-09-01'
     *        - name: endDate
     *          in: query
     *          description: 조회 종료일
     *          required: true
     *          schema:
     *            type: string
     *            example: '2022-09-30'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  type: object
     *                  properties:
     *                    _id:
     *                      type: string
     *                      description: 언어
     *                    count:
     *                      type: integer
     *                      description: 조회 수
     *              example:
     *              - _id: 'javascript'
     *                count: 15
     *              - _id: 'react'
     *                count: 10
     */
    // 가장 많이 조회해 본 언어 필터
    route.get('/posts/filter-rank', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, startDate, endDate, DashboardServiceInstance, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                    DashboardServiceInstance = new index_1.DashboardService();
                    return [4 /*yield*/, DashboardServiceInstance.findPostFilterRank(startDate, endDate)];
                case 1:
                    user = _b.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
});
//# sourceMappingURL=dashboard.js.map