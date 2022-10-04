"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignOutUser = void 0;
var mongoose_1 = require("mongoose");
var SignOutUserSchema = new mongoose_1.Schema({
    idToken: { type: String, required: true },
    tokenType: { type: String, required: true },
    nickName: {
        type: String,
        maxlength: 100,
    },
    password: {
        type: String,
        minlength: 8,
    },
    signInDate: Date,
    signOutDate: Date,
    userId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});
var SignOutUser = (0, mongoose_1.model)('SignOutUser', SignOutUserSchema);
exports.SignOutUser = SignOutUser;
//# sourceMappingURL=SignOutUser.js.map