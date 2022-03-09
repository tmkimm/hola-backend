"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var index_1 = __importDefault(require("../config/index"));
exports.default = (function () {
    // configure mongoose(MongoDB)
    if (process.env.NODE_ENV !== 'test') {
        mongoose_1.default.connect(index_1.default.databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: false,
        });
    }
});
//# sourceMappingURL=mongoose.js.map