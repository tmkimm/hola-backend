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
var User_1 = require("../../models/User");
var isPasswordValidWithAdmin_1 = require("../middlewares/isPasswordValidWithAdmin");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /**
     * @swagger
     * tags:
          - name: admin
     */
    app.use('/admin', route);
    // #region Admin 로그인
    /**
     *
     * @swagger
     * paths:
     *   /admin/login:
     *    post:
     *      tags:
     *        - admin
     *      summary: Admin 로그인
     *      description: admin 계정으로 로그인한다.
     *      requestBody:
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                id:
     *                  type: string
     *                  description: admin id
     *                password:
     *                  type: string
     *                  description: admin password
     *              example:
     *                id: "admin"
     *                password: "pw"
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  loginSuccess:
     *                    type: boolean
     *                    description: 로그인 성공 여부
     *                  _id:
     *                    type: string
     *                    description: 사용자 id
     *                  nickName:
     *                    type: string
     *                    description: 닉네임
     *                  image:
     *                    type: string
     *                    description: 사용자 이미지
     *                  accessToken:
     *                    type: string
     *                    description: access token
     *                example:
     *                  loginSuccess: true
     *                  id: "63455237c1ddf6ff6c0d8d94"
     *                  nickName: "hola"
     *                  image: "default.png"
     */
    // #endregion
    route.post('/login', isPasswordValidWithAdmin_1.isPasswordValidWithAdmin, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
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
});
//# sourceMappingURL=admin.js.map