"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler_1 = __importDefault(require("./errorHandler"));
var express_1 = __importDefault(require("./express"));
var mongoose_1 = __importDefault(require("./mongoose"));
var sentry_1 = __importDefault(require("./sentry"));
exports.default = (function (app) {
    (0, mongoose_1.default)();
    (0, sentry_1.default)(app);
    (0, express_1.default)(app);
    (0, errorHandler_1.default)(app);
});
//# sourceMappingURL=index.js.map