'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Notification = void 0;
var mongoose_1 = require('mongoose');
var notificationSchema = new mongoose_1.Schema(
  {
    title: { type: String, default: null },
    content: { type: String, default: null },
    isRead: { type: Boolean, default: false },
    targetUserId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    createUserId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    createObjectId: { type: mongoose_1.Types.ObjectId },
    href: { type: String, default: null },
    readAt: Date,
    noticeType: String, // 알림 구분(like, comment, reply, couphone, notice)
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);
// 알림 리스트 조회
notificationSchema.statics.findNotifications = function (targetUserId) {
  return __awaiter(this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            this.find({ targetUserId: targetUserId })
              .populate('createUserId', 'nickName')
              // .populate({ path: 'postId', match: { isDeleted: false }, select: 'title' })
              .sort('+isRead -createdAt')
              .select('title content isRead href createUserId noticeType createdAt')
              // .limit(limit)
              .lean(),
          ];
        case 1:
          result = _a.sent();
          return [2 /*return*/, result];
      }
    });
  });
};
// 알림 상세 조회
notificationSchema.statics.findNotification = function (_id) {
  return __awaiter(this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            this.findOne({ _id: _id })
              .populate('createUserId', 'nickName')
              .select('title content isRead href createUserId noticeType createdAt'),
          ];
        case 1:
          result = _a.sent();
          return [2 /*return*/, result];
      }
    });
  });
};
// 읽지 않은 알림 수 조회
notificationSchema.statics.findUnReadCount = function (targetUserId) {
  return __awaiter(this, void 0, void 0, function () {
    var unReadCount;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, this.countDocuments({ targetUserId: targetUserId, isRead: false })];
        case 1:
          unReadCount = _a.sent();
          return [2 /*return*/, unReadCount];
      }
    });
  });
};
// 신규 알림 등록
notificationSchema.statics.registerNotification = function (
  postId,
  targetUserId,
  createUserId,
  noticeType,
  createObjectId,
  nickName,
) {
  return __awaiter(this, void 0, void 0, function () {
    var isNoticeExist, title;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, this.findOne({ href: postId.toString(), createUserId: createUserId })];
        case 1:
          isNoticeExist = _a.sent();
          if (!(!isNoticeExist && targetUserId !== createUserId)) return [3 /*break*/, 3];
          switch (noticeType) {
            case 'like':
              title = '\uD83D\uDC40 '.concat(
                nickName,
                '\uB2D8\uC774 \uB0B4 \uAE00\uC744 \uBD81\uB9C8\uD06C\uD588\uC5B4\uC694.',
              );
              break;
            case 'comment':
              title = '\uD83D\uDC40 '.concat(
                nickName,
                '\uB2D8\uC774 \uB0B4 \uAE00\uC5D0 \uB313\uAE00\uC744 \uB0A8\uACBC\uC5B4\uC694.',
              );
              break;
            case 'reply':
              title = '\uD83D\uDC40 '.concat(
                nickName,
                '\uB2D8\uC774 \uB0B4 \uAE00\uC5D0 \uB2F5\uAE00\uC744 \uB0A8\uACBC\uC5B4\uC694.',
              );
              break;
            default:
              title = '';
              break;
          }
          return [
            4 /*yield*/,
            this.create({
              targetUserId: targetUserId,
              createUserId: createUserId,
              href: postId,
              title: title,
              noticeType: noticeType,
              createObjectId: createObjectId,
            }),
          ];
        case 2:
          _a.sent();
          _a.label = 3;
        case 3:
          return [2 /*return*/];
      }
    });
  });
};
// 알림 삭제
notificationSchema.statics.deleteNotification = function (createObjectId) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, this.deleteMany({ createObjectId: createObjectId })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
// 글 삭제 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByPost = function (href) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, this.deleteMany({ href: href })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
// 회원 탈퇴 시 관련 알림 제거
notificationSchema.statics.deleteNotificationByUser = function (userId) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, this.deleteMany({ $or: [{ targetUserId: userId }, { createUserId: userId }] })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
// updateReadAt, updateReadAtByPost 분리하기
// 알림 읽음 처리
notificationSchema.statics.readNotification = function (_id) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            this.updateMany(
              {
                _id: _id,
                isRead: false,
              },
              {
                readAt: new Date(),
                isRead: true,
              },
            ),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
// 알림 전체 읽음 처리
notificationSchema.statics.readAll = function (targetUserId) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            this.updateMany(
              {
                targetUserId: targetUserId,
                isRead: false,
              },
              {
                readAt: new Date(),
                isRead: true,
              },
            ),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
var Notification = (0, mongoose_1.model)('Notification', notificationSchema);
exports.Notification = Notification;
//# sourceMappingURL=Notification.js.map
