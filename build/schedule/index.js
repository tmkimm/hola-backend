"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("./event");
var advertisement_1 = require("./advertisement");
exports.default = (function () {
    //postAutoClosing(); // 자동 마감
    (0, event_1.eventAutoClosing)(); // 공모전 신청 기간이 지나면 자동 마감
    (0, advertisement_1.adAutoClosing)(); // 광고 진행 기간이 지나면 자동 마감
});
//# sourceMappingURL=index.js.map