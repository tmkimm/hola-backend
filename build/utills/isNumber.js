"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = void 0;
var isNumber = function (value) {
    if (typeof value !== 'string') {
        return false;
    }
    if (value.trim() === '') {
        return false;
    }
    return !Number.isNaN(Number(value));
};
exports.isNumber = isNumber;
//# sourceMappingURL=isNumber.js.map