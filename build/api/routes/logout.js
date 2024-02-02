"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    app.use('/logout', route);
    /**
     * @swagger
     * paths:
     *   /logout:
     *    post:
     *      tags:
     *        - 로그인
     *      summary: 로그아웃
     *      description: '로그아웃 처리되며 Refresh Token이 삭제된다.'
     *      responses:
     *        204:
     *          description: successful operation
     */
    route.post('/', function (req, res, next) {
        res.clearCookie('R_AUTH');
        return res.status(204).json();
    });
});
//# sourceMappingURL=logout.js.map