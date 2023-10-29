"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mongoose_1 = __importDefault(require("mongoose"));
require("regenerator-runtime/runtime");
var supertest_1 = __importDefault(require("supertest"));
var app_1 = __importDefault(require("../../../app"));
var index_1 = __importDefault(require("../../../config/index"));
var mockData_1 = __importDefault(require("../../mockData"));
var accessToken;
var isAccessTokenValid = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, jsonwebtoken_1.default.verify(token, index_1.default.jwtSecretKey)];
            case 1:
                decodedUser = _a.sent();
                return [2 /*return*/, true];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongoose_1.default.connect(process.env.MONGODB_TEST_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                    autoIndex: false,
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post('/api/login').type('application/json').send({ loginType: 'guest' })];
            case 2:
                res = _a.sent();
                accessToken = res.body.accessToken;
                return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongoose_1.default.disconnect()];
            case 1:
                _a.sent();
                return [4 /*yield*/, mongoose_1.default.connection.close()];
            case 2:
                _a.sent();
                return [4 /*yield*/, app_1.default.close()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
describe('POST /api/users/sign', function () {
    it('s3 pre-sign url 정상 발급', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post('/api/users/sign')
                        .type('application/json')
                        .send({ fileName: mockData_1.default.DuplicateNickname })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body.preSignUrl).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('PATCH /api/users/:id', function () {
    it('사용자 id가 존재하지 않으면 404 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).patch("/api/users/".concat(mockData_1.default.InvalidUserId)).type('application/json')];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it('access token이 유효하지 않으면 401 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .patch('/api/users/61442c0e97ce44432e9d5f2d')
                        .type('application/json')
                        .set('Authorization', mockData_1.default.InvalidAccessToken)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it('닉네임이 중복되었을 경우 200 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .patch('/api/users/61442c0e97ce44432e9d5f2d')
                        .type('application/json')
                        .send({ nickName: 'Hola' })
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body.isExists).toEqual(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('내 정보 수정 완료 시 새로 발급된 Access Token이 유효한지 체크', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .patch('/api/users/61442c0e97ce44432e9d5f2d')
                        .type('application/json')
                        .send({ likeLanguages: mockData_1.default.PostLanguage })
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    res = _b.sent();
                    expect(res.status).toBe(200);
                    _a = expect;
                    return [4 /*yield*/, isAccessTokenValid(res.body.accessToken)];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(true)];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('DELETE /api/users/:id', function () {
    it('회원 탈퇴 시 access token이 유효하지 않으면 401 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .delete('/api/users/61442c0e97ce44432e9d5f2d')
                        .type('application/json')
                        .set('Authorization', mockData_1.default.InvalidAccessToken)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('GET /api/users/likes/:id', function () {
    it('정상적으로 조회', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .get('/api/users/likes/61442c0e97ce44432e9d5f2d')
                        .type('application/json')
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body.likePosts).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('GET /api/users/read-list/:id', function () {
    it('정상적으로 조회', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .get('/api/users/read-list/61442c0e97ce44432e9d5f2d')
                        .type('application/json')
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body.readList).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('GET /api/users/myposts/:id', function () {
    it('정상적으로 조회', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .get('/api/users/myposts/61442c0e97ce44432e9d5f2d')
                        .type('application/json')
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=user.test.js.map