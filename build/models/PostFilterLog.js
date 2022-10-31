"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostFilterLog = void 0;
var mongoose_1 = require("mongoose");
var PostFilterLogSchema = new mongoose_1.Schema({
    viewDate: Date,
    language: { type: [String] }, // 언어
});
var PostFilterLog = (0, mongoose_1.model)('PostFilterLog', PostFilterLogSchema);
exports.PostFilterLog = PostFilterLog;
//# sourceMappingURL=PostFilterLog.js.map