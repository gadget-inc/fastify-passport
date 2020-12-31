"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const Authenticator_1 = require("./Authenticator");
require("./type-extensions");
const passport = new Authenticator_1.default();
exports.default = passport;
var strategies_1 = require("./strategies");
Object.defineProperty(exports, "Strategy", { enumerable: true, get: function () { return strategies_1.Strategy; } });
