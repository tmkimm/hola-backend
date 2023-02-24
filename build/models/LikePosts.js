"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikePosts = void 0;
var mongoose_1 = require("mongoose");
var LikePostsSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: 'Post' },
    postId: { type: mongoose_1.Types.ObjectId, ref: 'Post' },
}, {
    timestamps: true,
});
var LikePosts = (0, mongoose_1.model)('LikePosts', LikePostsSchema);
exports.LikePosts = LikePosts;
//# sourceMappingURL=LikePosts.js.map