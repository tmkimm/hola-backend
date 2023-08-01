"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeForCreatedAt = void 0;
// 모집 마감일 계산
function timeForCreatedAt(createdAt) {
    var today = new Date();
    if (createdAt > today)
        return "";
    var betweenTime = Math.floor((today.getTime() - createdAt.getTime()) / 1000 / 60);
    if (betweenTime < 1)
        return '방금전';
    if (betweenTime < 60) {
        return "".concat(betweenTime, "\uBD84\uC804");
    }
    var betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return "".concat(betweenTimeHour, "\uC2DC\uAC04\uC804");
    }
    var betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return "".concat(betweenTimeDay, "\uC77C\uC804");
    }
    return "".concat(Math.floor(betweenTimeDay / 365), "\uB144\uC804");
}
exports.timeForCreatedAt = timeForCreatedAt;
//# sourceMappingURL=timeForCreatedAt.js.map