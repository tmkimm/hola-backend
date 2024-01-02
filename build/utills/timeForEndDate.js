"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeForEndDate = void 0;
// 모집 마감일 계산
function timeForEndDate(endDate) {
    var today = new Date();
    // 시간을 제외하고 day로만 계산
    if (endDate < today)
        return "";
    var betweenTime = Math.floor((endDate.getTime() - today.getTime()) / 1000 / 60);
    var betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24)
        return "\uC624\uB298 \uB9C8\uAC10";
    var betweenTimeDay = Math.ceil(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
        return "\uB9C8\uAC10 ".concat(betweenTimeDay, "\uC77C\uC804");
    }
    return "\uB9C8\uAC10 ".concat(Math.floor(betweenTimeDay / 365), "\uB144\uC804");
}
exports.timeForEndDate = timeForEndDate;
//# sourceMappingURL=timeForEndDate.js.map