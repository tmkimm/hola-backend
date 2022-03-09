"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var route = (0, express_1.Router)();
exports.default = (function (app) {
    /*
      로그아웃에 관련된 Router를 정의한다.
      # POST /logout : 로그아웃
      */
    app.use('/logout', route);
    // 로그아웃(Refresh Token 삭제)
    route.post('/', function (req, res, next) {
        res.clearCookie('R_AUTH');
        return res.status(204).json();
    });
});
//# sourceMappingURL=logout.js.map