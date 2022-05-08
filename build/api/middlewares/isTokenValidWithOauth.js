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
exports.isTokenValidWithOauth = void 0;
var axios_1 = __importDefault(require("axios"));
var google_auth_library_1 = require("google-auth-library");
var index_1 = __importDefault(require("../../config/index"));
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var CustomError_1 = __importDefault(require("../../CustomError"));
var client = new google_auth_library_1.OAuth2Client(index_1.default.googleClientID);
// 클라이언트에게 전달받은 token의 유효성을 체크하고 사용자 정보를 리턴한다.
var getUserInfoByOauth = function (loginType, code) { return __awaiter(void 0, void 0, void 0, function () {
    var idToken, name, email, ticket, payload, accessToken, userInfo, kakaoResponse, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (!(loginType === 'google')) return [3 /*break*/, 2];
                return [4 /*yield*/, client.verifyIdToken({
                        idToken: code,
                        audience: index_1.default.googleClientID,
                    })];
            case 1:
                ticket = _a.sent();
                payload = ticket.getPayload();
                if (payload) {
                    idToken = payload.sub;
                    name = payload.name;
                    email = payload.email;
                }
                return [3 /*break*/, 8];
            case 2:
                if (!(loginType === 'github')) return [3 /*break*/, 5];
                return [4 /*yield*/, axios_1.default.post('https://github.com/login/oauth/access_token', {
                        code: code,
                        client_id: index_1.default.githubClientID,
                        client_secret: index_1.default.githubClientSecret,
                    }, {
                        headers: {
                            accept: 'application/json',
                        },
                    })];
            case 3:
                accessToken = _a.sent();
                return [4 /*yield*/, axios_1.default.get('https://api.github.com/user', {
                        headers: {
                            Authorization: "token ".concat(accessToken.data.access_token),
                        },
                    })];
            case 4:
                userInfo = (_a.sent()).data;
                idToken = userInfo.id;
                name = userInfo.name;
                return [3 /*break*/, 8];
            case 5:
                if (!(loginType === 'kakao')) return [3 /*break*/, 7];
                return [4 /*yield*/, axios_1.default.post('https://kapi.kakao.com/v2/user/me', {
                        property_keys: ['kakao_account.email'],
                    }, {
                        headers: {
                            Authorization: "Bearer ".concat(code),
                        },
                    })];
            case 6:
                kakaoResponse = _a.sent();
                idToken = kakaoResponse.data.id;
                name = kakaoResponse.data.kakao_account.profile.nickname;
                return [3 /*break*/, 8];
            case 7:
                if (loginType === 'guest') {
                    idToken = 'Guest';
                }
                _a.label = 8;
            case 8: return [2 /*return*/, { idToken: idToken, name: name, email: email }];
            case 9:
                error_1 = _a.sent();
                return [2 /*return*/, { idToken: idToken, name: name, email: email }];
            case 10: return [2 /*return*/];
        }
    });
}); };
// 클라이언트에게 전달받은 token을 이용해 사용자 정보를 가져온다.
// 각 소셜 로그인에 따라 Oauth 서버를 호출한다.
var isTokenValidWithOauth = (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, loginType, code, _b, idToken, name, email;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, loginType = _a.loginType, code = _a.code;
                return [4 /*yield*/, getUserInfoByOauth(loginType, code)];
            case 1:
                _b = _c.sent(), idToken = _b.idToken, name = _b.name, email = _b.email;
                if (idToken) {
                    req.user = { idToken: idToken, tokenType: loginType, name: name, email: email };
                    next();
                }
                else {
                    throw new CustomError_1.default('OauthError', 400, 'Oauth parameter is Invalid');
                }
                return [2 /*return*/];
        }
    });
}); });
exports.isTokenValidWithOauth = isTokenValidWithOauth;
//# sourceMappingURL=isTokenValidWithOauth.js.map