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
var index_1 = require("../../services/index");
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /*
      dashboard에 관련된 Router를 정의한다.
      */
    app.use('/dashboard', route);
    // 사용자 정보 데일리(현재 총 회원 수, 오늘 가입자, 오늘 탈퇴자)
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
    // 일자별 회원 가입 현황(일자, 신규 가입자, 탈퇴자)
    route.get('/users/history', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var DashboardServiceInstance, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    DashboardServiceInstance = new index_1.DashboardService();
                    return [4 /*yield*/, DashboardServiceInstance.findUserHistory()];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
    // 게시글 데일리(오늘 전체 글 조회 수, 등록된 글, 글 마감 수, 글 삭제 수 )
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
    // 일자별 게시글 현황(일자, 등록된 글, 마감된 글, 삭제된 글)
    route.get('/posts/history', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var DashboardServiceInstance, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    DashboardServiceInstance = new index_1.DashboardService();
                    return [4 /*yield*/, DashboardServiceInstance.findPostHistory()];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
    // 가장 많이 조회해 본 언어 필터
    route.get('/posts/filter-rank', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var DashboardServiceInstance, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    DashboardServiceInstance = new index_1.DashboardService();
                    return [4 /*yield*/, DashboardServiceInstance.findPostFilterRank()];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, res.status(200).json(user)];
            }
        });
    }); }));
});
//# sourceMappingURL=dashboard.js.map