'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var express_1 = __importDefault(require('express'));
var process_1 = __importDefault(require('process'));
var index_1 = __importDefault(require('./config/index'));
var index_2 = __importDefault(require('./loaders/index'));
var app = (0, express_1.default)();
global.__rootdir__ = __dirname;
(0, index_2.default)(app);
var server = app.listen(index_1.default.port, function () {
  if (typeof process_1.default.send === 'function') {
    process_1.default.send('ready');
  }
});
exports.default = server;
//# sourceMappingURL=app.js.map
