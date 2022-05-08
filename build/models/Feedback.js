"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
var mongoose_1 = require("mongoose");
var feedbackSchema = new mongoose_1.Schema({
    rating: Number,
    content: String,
}, {
    timestamps: true,
});
var Feedback = (0, mongoose_1.model)('Feedback', feedbackSchema);
exports.Feedback = Feedback;
//# sourceMappingURL=Feedback.js.map