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
var auth_1 = require("../../services/auth");
var notification_1 = require("../../services/notification");
var index_1 = require("../middlewares/index");
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var CustomError_1 = __importDefault(require("../../CustomError"));
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /**
     * @swagger
     *  components:
     *    securitySchemes:
     *      bearerAuth:
     *        type: http
     *        scheme: bearer
     *        bearerFormat: JWT
     *    responses:
     *      UnauthorizedError:
     *        description: Access token is missing or invalid
     */
    /*
      권한에 관련된 Router를 정의한다.
      # GET /auth : Refresh Token을 이용해 Access Token 발급
      - Refresh Token이 존재하지 않거나 유효하지 않을 경우 error: -1
      - Access Token이 유효하지 않을 경우 error: -2
      */
    app.use('/auth', route);
    // Refresh Token을 이용해 Access Token 발급
    route.get('/', (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, decodeSuccess, _id, nickName, image, likeLanguages, accessToken, unReadNoticeCount, hasUnreadNotice;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.cookies.R_AUTH) {
                        throw new CustomError_1.default('RefreshTokenError', 401, 'Refresh token not found');
                    }
                    return [4 /*yield*/, (0, auth_1.reissueAccessToken)(req.cookies.R_AUTH)];
                case 1:
                    _a = _b.sent(), decodeSuccess = _a.decodeSuccess, _id = _a._id, nickName = _a.nickName, image = _a.image, likeLanguages = _a.likeLanguages, accessToken = _a.accessToken;
                    // Refresh Token가 유효하지 않을 경우
                    if (!decodeSuccess || typeof _id === 'undefined') {
                        res.clearCookie('R_AUTH');
                        throw new CustomError_1.default('RefreshTokenError', 401, 'Invalid refresh token');
                    }
                    return [4 /*yield*/, (0, notification_1.findUnReadCount)(_id)];
                case 2:
                    unReadNoticeCount = _b.sent();
                    hasUnreadNotice = unReadNoticeCount > 0;
                    return [2 /*return*/, res.status(200).json({
                            _id: _id,
                            nickName: nickName,
                            image: image,
                            likeLanguages: likeLanguages,
                            accessToken: accessToken,
                            hasUnreadNotice: hasUnreadNotice,
                        })];
            }
        });
    }); }));
    // Access Token이 유효한지 체크
    route.get('/isValid', index_1.isAccessTokenValid, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, res.status(200).json({
                    isValid: true,
                })];
        });
    }); });
});
//# sourceMappingURL=auth.js.map