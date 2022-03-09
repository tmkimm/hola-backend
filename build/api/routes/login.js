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
var index_2 = require("../middlewares/index");
var asyncErrorWrapper_1 = require("../../asyncErrorWrapper");
var Post_1 = require("../../models/Post");
var User_1 = require("../../models/User");
var Notification_1 = require("../../models/Notification");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /*
      로그인에 관련된 Router를 정의한다.
      로그인 시 각 소셜 로그인 Oauth 서버를 통해 올바른 토큰인지 확인한다.(idToken)
      # POST /login/signup : 로그인 후 회원 가입
      # POST /login/google : Oauth 구글 로그인
      # POST /login/github : Oauth 깃 로그인
      # POST /login/kakao : Oauth 카카오 로그인
      */
    app.use('/login', route);
    // Oauth2.0 로그인
    // isTokenValidWithGoogle : 클라이언트에게 전달받은 idToken을 이용해 유효성 검증 후 사용자 정보를 가져온다.
    route.post('/', index_2.isTokenValidWithOauth, index_2.autoSignUp, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var idToken, AuthServiceInstance, _a, _id, nickName, image, likeLanguages, accessToken, refreshToken;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    idToken = req.user.idToken;
                    AuthServiceInstance = new index_1.AuthService(User_1.User);
                    return [4 /*yield*/, AuthServiceInstance.SignIn(idToken)];
                case 1:
                    _a = _b.sent(), _id = _a._id, nickName = _a.nickName, image = _a.image, likeLanguages = _a.likeLanguages, accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                    res.cookie('R_AUTH', refreshToken, {
                        sameSite: 'none',
                        httpOnly: true,
                        secure: true,
                        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
                    });
                    return [2 /*return*/, res.status(200).json({
                            loginSuccess: true,
                            _id: _id,
                            nickName: nickName,
                            image: image,
                            likeLanguages: likeLanguages,
                            accessToken: accessToken,
                        })];
            }
        });
    }); }));
    // 회원 가입
    // - 로그인 시 회원 정보가 Insert되므로 회원 가입 시 정보를 수정한다.
    // - 회원 가입 완료 시 Refresh Token과 Access Token이 발급된다.
    route.post('/signup', index_2.nickNameDuplicationCheck, index_2.isUserIdValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, userDTO, UserServiceInstance, userRecord, AuthServiceInstance, _a, accessToken, refreshToken;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.body.id;
                    userDTO = req.body;
                    delete userDTO.id;
                    UserServiceInstance = new index_1.UserService(Post_1.Post, User_1.User, Notification_1.Notification);
                    return [4 /*yield*/, UserServiceInstance.modifyUser(id, id, userDTO)];
                case 1:
                    userRecord = (_b.sent()).userRecord;
                    AuthServiceInstance = new index_1.AuthService(User_1.User);
                    return [4 /*yield*/, AuthServiceInstance.SignIn(userRecord.idToken)];
                case 2:
                    _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                    res.cookie('R_AUTH', refreshToken, {
                        sameSite: 'none',
                        httpOnly: true,
                        secure: true,
                        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
                    });
                    return [2 /*return*/, res.status(200).json({
                            loginSuccess: true,
                            _id: userRecord._id,
                            nickName: userRecord.nickName,
                            image: userRecord.image,
                            accessToken: accessToken,
                        })];
            }
        });
    }); }));
});
//# sourceMappingURL=login.js.map