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
var Sentry = __importStar(require("@sentry/node"));
var Tracing = __importStar(require("@sentry/tracing"));
var integrations_1 = require("@sentry/integrations");
var index_1 = __importDefault(require("../config/index"));
exports.default = (function (app) {
    Sentry.init({
        dsn: index_1.default.SentryDsn,
        tracesSampleRate: 0.2,
        enabled: process.env.NODE_ENV === 'production',
        integrations: [
            new integrations_1.RewriteFrames({
                root: global.__rootdir__,
            }),
            new Sentry.Integrations.Http({ tracing: true }),
            new Tracing.Integrations.Express({ app: app }),
        ],
    });
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
});
//# sourceMappingURL=sentry.js.map