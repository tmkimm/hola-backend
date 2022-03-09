"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = __importDefault(require("http-errors"));
var mongoose_1 = __importDefault(require("mongoose"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var Sentry = __importStar(require("@sentry/node"));
var client_1 = require("@slack/client");
var index_1 = __importDefault(require("../config/index"));
var CustomError_1 = __importDefault(require("../CustomError"));
exports.default = (function (app) {
    app.use(Sentry.Handlers.errorHandler({
        shouldHandleError: function (error) {
            // is Custom Error
            if (error.message !== "jwt malformed" && !("type" in error)) {
                var webhook = new client_1.IncomingWebhook(index_1.default.SlackWebhook);
                webhook
                    .send({
                    attachments: [
                        {
                            color: 'danger',
                            text: '백엔드 에러 발생',
                            fields: [
                                {
                                    title: error.message,
                                    value: error.stack,
                                    short: false,
                                },
                            ],
                            ts: Math.floor(new Date().getTime() / 1000).toString(),
                        },
                    ],
                })
                    .catch(function (err) {
                    if (err)
                        Sentry.captureException(err);
                });
                return true;
            }
            return false;
        },
    }));
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next((0, http_errors_1.default)(404));
    });
    app.use(function handleMongoError(error, req, res, next) {
        if (error instanceof mongoose_1.default.Error)
            return res.status(400).json({ type: 'MongoError', message: error.message });
        next(error);
    });
    app.use(function handlejwtError(error, req, res, next) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError)
            return res.status(401).json({ type: 'TokenExpiredError', message: error.message });
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError)
            return res.status(401).json({ type: 'JsonWebTokenError', message: error.message });
        next(error);
    });
    // custom error handler
    app.use(function handlecustomError(error, req, res, next) {
        if (error instanceof CustomError_1.default) {
            var status_1 = error.status, type = error.type, message = error.message;
            return res.status(status_1).send({ type: type, message: message });
        }
        next(error);
    });
    // error handler
    app.use(function (error, req, res, next) {
        return res.status(400).json({ message: error.message });
    });
});
//# sourceMappingURL=errorHandler.js.map