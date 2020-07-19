"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Authenticator_1 = __importDefault(require("../src/Authenticator"));
const helpers_1 = require("./helpers");
test("should be able to unuse strategy", () => {
    const fastifyPassport = new Authenticator_1.default();
    const testStrategy = new helpers_1.TestStrategy("test");
    fastifyPassport.use(testStrategy);
    fastifyPassport.unuse("test");
});
test("should throw error if strategy has no name", () => {
    const fastifyPassport = new Authenticator_1.default();
    expect(() => {
        fastifyPassport.use({});
    }).toThrow();
});
//# sourceMappingURL=strategy.test.js.map