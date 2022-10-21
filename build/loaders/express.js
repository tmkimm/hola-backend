"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var express_basic_auth_1 = __importDefault(require("express-basic-auth"));
var index_1 = __importDefault(require("../config/index"));
var index_2 = __importDefault(require("../api/index"));
var index_3 = __importDefault(require("../schedule/index"));
var swagger_1 = __importDefault(require("../swagger/swagger"));
exports.default = (function (app) {
    var _a;
    var whitelist = [
        'http://localhost:3000',
        'http://holaworld.io',
        'https://holaworld.io',
        'http://www.holaworld.io',
        'https://www.holaworld.io',
        'ngork.io',
    ];
    // type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];
    var corsOptions = {
        origin: function (origin, callback) {
            var isWhitelisted = origin && whitelist.indexOf(origin) !== -1;
            callback(null, isWhitelisted);
        },
        credentials: true,
    };
    // Cors Whitelist 관리
    app.use((0, cors_1.default)(corsOptions));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.static(path_1.default.join(path_1.default.resolve(), 'public')));
    // API Route 설정
    app.use(index_1.default.api.prefix, (0, index_2.default)());
    app.use(['/api-docs'], (0, express_basic_auth_1.default)({
        challenge: true,
        users: (_a = {},
            _a[index_1.default.AdminId] = index_1.default.AdminPassword,
            _a),
    }));
    // Swagger
    var specs = (0, swagger_jsdoc_1.default)(swagger_1.default);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    // 스케줄러 실행
    (0, index_3.default)();
});
//# sourceMappingURL=express.js.map