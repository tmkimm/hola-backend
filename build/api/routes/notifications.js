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
var Notification_1 = require("../../models/Notification");
var index_1 = require("../../services/index");
var index_2 = require("../middlewares/index");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    app.use('/notifications', route);
    /**
     * @swagger
     * paths:
     *   /notifications:
     *    get:
     *      tags:
     *        - 알림
     *      summary: 내 알림 조회
     *      description: '내 알림을 조회한다.'
     *      responses:
     *        200:
     *          description: successful operation
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: '#/components/schemas/Notification'
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    route.get('/', index_2.isAccessTokenValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, NoticeServiceInstance, notifications;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = req.user._id;
                    NoticeServiceInstance = new index_1.NotificationService(Notification_1.Notification);
                    return [4 /*yield*/, NoticeServiceInstance.findNotifications(userId)];
                case 1:
                    notifications = _a.sent();
                    return [2 /*return*/, res.status(200).json(notifications)];
            }
        });
    }); }));
    /**
     * @swagger
     * paths:
     *   /notifications:
     *    patch:
     *      tags:
     *        - 알림
     *      summary: 알림 읽음 처리
     *      description: '알림을 읽음 처리한다.'
     *      parameters:
     *        - name: accessToken
     *          in: header
     *          description: access token
     *          required: true
     *          schema:
     *            type: string
     *        - name: id
     *          in: path
     *          description: 알림 Id
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
     *                type: object
     *                properties:
     *                  isRead:
     *                    type: boolean
     *                    description : 읽음 여부
     *                    example: true
     *        401:
     *          $ref: '#/components/responses/UnauthorizedError'
     */
    // 알림 읽음 처리
    route.patch('/:id/read', index_2.isAccessTokenValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, NotificationServcieInstance, notice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    NotificationServcieInstance = new index_1.NotificationService(Notification_1.Notification);
                    return [4 /*yield*/, NotificationServcieInstance.readNotification(mongoose_1.Types.ObjectId(id))];
                case 1:
                    notice = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            isRead: true,
                        })];
            }
        });
    }); }));
    // 알림 전체 읽음 처리
    route.patch('/read-all', index_2.isAccessTokenValid, (0, asyncErrorWrapper_1.asyncErrorWrapper)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, NotificationServcieInstance, notice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = req.user._id;
                    NotificationServcieInstance = new index_1.NotificationService(Notification_1.Notification);
                    return [4 /*yield*/, NotificationServcieInstance.readAll(userId)];
                case 1:
                    notice = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            isRead: true,
                        })];
            }
        });
    }); }));
});
//# sourceMappingURL=notifications.js.map