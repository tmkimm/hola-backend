"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAccessToken = exports.verifyJWT = exports.signJWT = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var isStringEmpty_1 = require("./isStringEmpty");
var index_1 = __importDefault(require("../config/index"));
function signJWT(payload, expiresIn) {
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.sign(payload, index_1.default.jwtSecretKey, {
            expiresIn: expiresIn,
            issuer: index_1.default.issuer,
        }, function (err, token) {
            if (err || !(0, isStringEmpty_1.isString)(token))
                reject(err);
            resolve(token);
        });
    });
}
exports.signJWT = signJWT;
function verifyJWT(token) {
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.verify(token, index_1.default.jwtSecretKey, function (err, decoded) {
            if (err)
                reject(err);
            resolve(decoded);
        });
    });
}
exports.verifyJWT = verifyJWT;
function isValidAccessToken(decoded) {
    return !!(typeof decoded !== 'string' && ('idToken' in decoded));
}
exports.isValidAccessToken = isValidAccessToken;
//# sourceMappingURL=jwt.js.map