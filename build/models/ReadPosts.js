"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadPosts = void 0;
var mongoose_1 = require("mongoose");
var ReadPostsSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    postId: { type: mongoose_1.Types.ObjectId, ref: 'Post' },
}, {
    timestamps: true,
});
var ReadPosts = (0, mongoose_1.model)('ReadPosts', ReadPostsSchema);
exports.ReadPosts = ReadPosts;
//# sourceMappingURL=ReadPosts.js.map