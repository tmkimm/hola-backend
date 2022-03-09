"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var post_1 = __importDefault(require("./routes/post"));
var auth_1 = __importDefault(require("./routes/auth"));
var login_1 = __importDefault(require("./routes/login"));
var logout_1 = __importDefault(require("./routes/logout"));
var user_1 = __importDefault(require("./routes/user"));
var feedback_1 = __importDefault(require("./routes/feedback"));
var comment_1 = __importDefault(require("./routes/comment"));
var reply_1 = __importDefault(require("./routes/reply"));
exports.default = (function () {
    var app = (0, express_1.Router)();
    (0, auth_1.default)(app);
    (0, login_1.default)(app);
    (0, logout_1.default)(app);
    (0, user_1.default)(app);
    (0, post_1.default)(app);
    (0, feedback_1.default)(app);
    (0, comment_1.default)(app);
    (0, reply_1.default)(app);
    return app;
});
//# sourceMappingURL=index.js.map