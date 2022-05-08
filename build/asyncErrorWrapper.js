"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorWrapper = void 0;
function asyncErrorWrapper(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}
exports.asyncErrorWrapper = asyncErrorWrapper;
//# sourceMappingURL=asyncErrorWrapper.js.map