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
exports.reissueAccessToken = exports.SignIn = void 0;
var CustomError_1 = __importDefault(require("../CustomError"));
var User_1 = require("../models/User");
var jwt_1 = require("../utills/jwt");
// 로그인 시 사용자 정보를 조회, Token을 생성한다.
var SignIn = function (idToken) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _id, nickName, image, likeLanguages, _a, accessToken, refreshToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, User_1.User.findByIdToken(idToken)];
            case 1:
                user = _b.sent();
                if (!user)
                    throw new CustomError_1.default('InvaildParameterError', 401, 'User not found');
                _id = user._id, nickName = user.nickName, image = user.image, likeLanguages = user.likeLanguages;
                return [4 /*yield*/, Promise.all([user.generateAccessToken(), user.generateRefreshToken()])];
            case 2:
                _a = _b.sent(), accessToken = _a[0], refreshToken = _a[1];
                return [2 /*return*/, { _id: _id, nickName: nickName, image: image, likeLanguages: likeLanguages, accessToken: accessToken, refreshToken: refreshToken }];
        }
    });
}); };
exports.SignIn = SignIn;
// Refresh Token을 이용하여 Access Token 재발급한다.
var reissueAccessToken = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var decodeSuccess, decodeRefreshToken, user, _id, nickName, email, image, likeLanguages, accessToken, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decodeSuccess = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, jwt_1.verifyJWT)(refreshToken)];
            case 2:
                decodeRefreshToken = _a.sent();
                if (typeof decodeRefreshToken === 'string')
                    throw new CustomError_1.default('JsonWebTokenError', 401, 'Invaild Token');
                return [4 /*yield*/, User_1.User.findByNickName(decodeRefreshToken.nickName)];
            case 3:
                user = _a.sent();
                if (!user)
                    throw new CustomError_1.default('InvaildParameterError', 401, 'User not found');
                _id = user._id, nickName = user.nickName, email = user.email, image = user.image, likeLanguages = user.likeLanguages;
                return [4 /*yield*/, user.generateAccessToken()];
            case 4:
                accessToken = _a.sent();
                return [2 /*return*/, { decodeSuccess: decodeSuccess, _id: _id, nickName: nickName, email: email, image: image, likeLanguages: likeLanguages, accessToken: accessToken }];
            case 5:
                err_1 = _a.sent();
                decodeSuccess = false;
                return [2 /*return*/, { decodeSuccess: decodeSuccess }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.reissueAccessToken = reissueAccessToken;
//# sourceMappingURL=auth.js.map