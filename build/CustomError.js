"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CustomError = /** @class */ (function (_super) {
    __extends(CustomError, _super);
    function CustomError(type, status) {
        if (type === void 0) { type = 'GENERIC'; }
        if (status === void 0) { status = 400; }
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        var _this = _super.apply(this, params) || this;
        _this.type = type;
        _this.status = status;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, CustomError);
        }
        _this.type = type;
        _this.status = status;
        return _this;
    }
    return CustomError;
}(Error));
exports.default = CustomError;
//# sourceMappingURL=CustomError.js.map