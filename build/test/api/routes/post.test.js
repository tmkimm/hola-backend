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
var mongoose_1 = __importDefault(require("mongoose"));
require("regenerator-runtime/runtime");
var supertest_1 = __importDefault(require("supertest"));
var app_1 = __importDefault(require("../../../app"));
var mockData_1 = __importDefault(require("../../mockData"));
var accessToken;
var newPostId;
var createPostData = {
    language: mockData_1.default.PostLanguage,
    title: mockData_1.default.PostTitle,
    content: mockData_1.default.PostContent,
};
var getAccessToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).post('/api/login').type('application/json').send({ loginType: 'guest' })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.body.accessToken];
        }
    });
}); };
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, getAccessToken()];
            case 2:
                // accessToken 발급
                accessToken = _a.sent();
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
describe('POST /api/posts', function () {
    it('access token이 유효하지 않을 경우 401 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post('/api/posts')
                        .type('application/json')
                        .send(createPostData)
                        .set('Authorization', mockData_1.default.InvalidAccessToken)];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    it('글 등록 성공 시 201 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post('/api/posts')
                        .type('application/json')
                        .send(createPostData)
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(201);
                    newPostId = res.body._id;
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('PATCH /api/posts', function () {
    it('글 수정 성공 시 201 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .patch("/api/posts/".concat(newPostId))
                        .type('application/json')
                        .send(createPostData)
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('GET /api/posts/:id', function () {
    it('글 id가 존재하지 않을 경우 404 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/posts/".concat(mockData_1.default.InvalidPostId))];
                case 1:
                    result = _a.sent();
                    expect(result.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it('신규 등록한 글 상세 정상 조회', function () { return __awaiter(void 0, void 0, void 0, function () {
        var post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/posts/".concat(newPostId))];
                case 1:
                    post = _a.sent();
                    expect(post.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('글 필수 필드 존재하는지 확인', function () { return __awaiter(void 0, void 0, void 0, function () {
        var post, requiredField;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/posts/".concat(newPostId))];
                case 1:
                    post = _a.sent();
                    requiredField = ["title", "content", "language", "isClosed", "createdAt", "likes", "views", "_id"];
                    requiredField.forEach(function (v) {
                        expect(post.body).toHaveProperty(v);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('POST /api/posts/likes', function () {
    it('좋아요 추가 성공 시 201 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .post('/api/posts/likes')
                        .type('application/json')
                        .send({ postId: newPostId })
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(201);
                    expect(res.body.likeUsers).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('DELETE /api/posts/likes', function () {
    it('좋아요 삭제 성공 시 201 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .delete("/api/posts/likes/".concat(newPostId))
                        .type('application/json')
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(201);
                    expect(res.body.likeUsers).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('DELETE /api/posts/:id', function () {
    it('글 id가 존재하지 않을 경우 404 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).delete("/api/posts/".concat(mockData_1.default.InvalidPostId))];
                case 1:
                    result = _a.sent();
                    expect(result.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it('정상 삭제 시 204 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default)
                        .delete("/api/posts/".concat(newPostId))
                        .set('Authorization', "Bearer ".concat(accessToken))];
                case 1:
                    result = _a.sent();
                    expect(result.status).toBe(204);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('GET /api/posts', function () {
    it('글 리스트 정상 조회 시 200 응답', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get('/api/posts')];
                case 1:
                    result = _a.sent();
                    expect(result.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('필수 필드 존재하는지 확인', function () { return __awaiter(void 0, void 0, void 0, function () {
        var post, requiredField;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app_1.default).get("/api/posts")];
                case 1:
                    post = _a.sent();
                    requiredField = ["title", "language", "isClosed", "likes", "views", "_id"];
                    post.body.forEach(function (v) {
                        requiredField.forEach(function (field) {
                            expect(v).toHaveProperty(field);
                        });
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=post.test.js.map