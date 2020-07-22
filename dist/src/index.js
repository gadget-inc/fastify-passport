"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Authenticator_1 = __importDefault(require("./Authenticator"));
require("./type-extensions");
const passport = new Authenticator_1.default();
exports.default = passport;
var strategies_1 = require("./strategies");
Object.defineProperty(exports, "Strategy", { enumerable: true, get: function () { return strategies_1.Strategy; } });
//# sourceMappingURL=index.js.map